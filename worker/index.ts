import {INTENTS,GROUPS,FREE_MONTHLY_SEARCH_CREDITS,AVAILABILITY_RESERVE_RATE,AVAILABILITY_DURATION_HOURS,getIntent} from "../shared/catalog";
interface Env {
 DB?: D1Database;
 ASSETS: Fetcher;
 WAITLIST_ENABLED?: string;
 RATE_LIMIT_SALT?: string;
 TELEGRAM_BOT_TOKEN?: string;
 TELEGRAM_WEBHOOK_SECRET?: string;
}
type ErrorPayload={error:string};
type TelegramCallback={id:string;data?:string;message?:{chat?:{id:number}}};
type TelegramMessage={chat?:{id:number};text?:string};
type TelegramUpdate={update_id?:number;callback_query?:TelegramCallback;message?:TelegramMessage};
const JSON_HEADERS={"content-type":"application/json;charset=utf-8","cache-control":"no-store"};
const MAX_WAITLIST_BODY=2048,MAX_TELEGRAM_BODY=200_000;
const EMAIL=/^[^@\s]+@[^@\s]+\.[^@\s]+$/;
function json(data:unknown,status=200){return new Response(JSON.stringify(data),{status,headers:JSON_HEADERS});}
function err(status:number,message:string){return json({error:message} satisfies ErrorPayload,status);}
async function sha256(input:string){
 const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(input));
 return [...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,"0")).join("");
}
async function equalSecret(a:string,b:string){
 const [left,right]=await Promise.all([sha256(a),sha256(b)]);
 let x=0;
 for(let i=0;i<left.length;i++)x|=left.charCodeAt(i)^right.charCodeAt(i);
 return x===0;
}
async function registerEarlyAccess(request:Request,env:Env){
 if(env.WAITLIST_ENABLED!=="true")return err(503,"Early access signups aren't enabled yet.");
 if(!env.DB||!env.RATE_LIMIT_SALT)return err(503,"Early access is temporarily unavailable.");
 if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return err(403,"Invalid origin.");
 if(!(request.headers.get("content-type")||"").startsWith("application/json"))return err(415,"Send JSON.");
 if(Number(request.headers.get("content-length")||"0")>MAX_WAITLIST_BODY)return err(413,"Request too large.");
 let payload:unknown;
 try{
  const body=await request.text();if(body.length>MAX_WAITLIST_BODY)return err(413,"Request too large.");
  payload=JSON.parse(body);
 }catch{return err(400,"Invalid JSON.");}
 if(!payload||typeof payload!=="object")return err(400,"Invalid submission.");
 const data=payload as {email?:unknown;consent?:unknown};
 if(typeof data.email!=="string"||data.email.length>254||!EMAIL.test(data.email.trim())||data.consent!==true)return err(400,"Enter a valid email to receive updates.");
 const email=data.email.trim().toLowerCase();
 const date=new Date().toISOString().slice(0,10);
 const ip=request.headers.get("cf-connecting-ip")||"unavailable";
 const hash=await sha256(env.RATE_LIMIT_SALT+":"+date+":"+ip);
 try{
  const recent=await env.DB.prepare("SELECT submissions FROM early_access_rate WHERE id=?").bind(hash).first<{submissions:number}>();
  if(recent&&recent.submissions>=5)return err(429,"Too many submissions today.");
  await env.DB.batch([
   env.DB.prepare("INSERT INTO early_access (email,consent_at) VALUES (?,datetime('now')) ON CONFLICT(email) DO NOTHING").bind(email),
   env.DB.prepare("INSERT INTO early_access_rate (id,submissions,day) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET submissions=submissions+1").bind(hash,date)
  ]);
  return json({ok:true,message:"You are on the early-access list."});
 }catch(e){console.error(JSON.stringify({event:"waitlist_error",reason:String((e as Error)?.message||"unknown")}));return err(503,"Signups are temporarily unavailable.");}
}
const keyboard=(rows:{text:string;callback_data:string}[][])=>({inline_keyboard:rows});
const b=(text:string,callback_data:string)=>({text,callback_data});
const groups=GROUPS.map(group=>({id:group.id,name:group.label,items:INTENTS.filter(i=>i.group===group.id)}));
const cash=(amount:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(amount);
async function telegram(env:Env,method:string,body:Record<string,unknown>){
 if(!env.TELEGRAM_BOT_TOKEN)throw new Error("Telegram token absent");
 const response=await fetch("https://api.telegram.org/bot"+env.TELEGRAM_BOT_TOKEN+"/"+method,{
  method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
 if(!response.ok)throw new Error("Telegram "+method+" failed with "+response.status);
}
async function send(env:Env,chatId:number,text:string,rows?:{text:string;callback_data:string}[][]){
 await telegram(env,"sendMessage",{chat_id:chatId,text,disable_web_page_preview:true,...(rows?{reply_markup:keyboard(rows)}:{})});
}
const homeMenu=()=>[...groups.map(g=>[b(g.name,"group:"+g.id)]),[b("How Emorva works","about")]];
async function handleTelegram(env:Env,request:Request){
 if(!env.TELEGRAM_WEBHOOK_SECRET||!env.TELEGRAM_BOT_TOKEN)return err(503,"Telegram not configured.");
 const received=request.headers.get("X-Telegram-Bot-Api-Secret-Token")||"";
 if(!await equalSecret(received,env.TELEGRAM_WEBHOOK_SECRET))return err(403,"Forbidden.");
 if(Number(request.headers.get("content-length")||"0")>MAX_TELEGRAM_BODY)return err(413,"Payload too large.");
 let update:TelegramUpdate;
 try{
  const raw=await request.text();if(raw.length>MAX_TELEGRAM_BODY)return err(413,"Payload too large.");
  update=JSON.parse(raw) as TelegramUpdate;
 }catch{return err(400,"Invalid Telegram request.");}
 if(update.callback_query?.message?.chat?.id){
  const cb=update.callback_query;
  const id=cb.message?.chat?.id;
  if(typeof id!=="number")return json({ok:true});
  await telegram(env,"answerCallbackQuery",{callback_query_id:cb.id});
  if(cb.data==="back"){await send(env,id,"What kind of connection would you like?",homeMenu());return json({ok:true});}
  if(cb.data==="about"){
   await send(env,id,"Emorva ♡ Where chemistry begins.\n\nAn adult-only matching service in development. Members will receive search credits and can request mutual introductions. No charges or contact exchanges are enabled yet.",[[b("Browse connection types","back")]]);
   return json({ok:true});
  }
  if(cb.data?.startsWith("group:")){
   const group=groups.find(g=>g.id===cb.data?.slice(6));
   if(!group)return json({ok:true});
   const choices=group.items.map(i=>[b(i.label+" · "+cash(i.feeNgn),"intent:"+i.id)]);
   choices.push([b("‹ Back","back")]);
   await send(env,id,group.name+"\nChoose a specific intention:",choices);
   return json({ok:true});
  }
  if(cb.data?.startsWith("intent:")){
   const intent=getIntent(cb.data.slice(7));
   if(!intent)return json({ok:true});
   await send(env,id,intent.label+"\n\nProposed introduction fee: "+cash(intent.feeNgn)+
    "\n\nThis is for a mutual platform introduction—not dates, intimacy, or guaranteed meetings.\n\nEmorva is not accepting payments or matchmaking requests yet.",[[b("‹ Back to categories","back")]]);
   return json({ok:true});
  }
 }
 if(update.message?.chat?.id){
  await send(env,update.message.chat.id,
   "Welcome to Emorva ♡\nWhere chemistry begins.\n\nExplore our adult connection categories and proposed fees. Actual matchmaking is coming soon.\n\nAdults 18+ only.",homeMenu());
 }
 return json({ok:true});
}
export default {
 async fetch(request:Request,env:Env):Promise<Response>{
  const {pathname}=new URL(request.url);
  if(pathname==="/api/health"&&request.method==="GET"){
   return json({ok:true,service:"emorva",stage:"development",paymentsEnabled:false,contactExchangeEnabled:false});
  }
  if(pathname==="/api/catalog"&&request.method==="GET"){
   return json({stage:"planning",paymentsEnabled:false,freeSearchCredits:FREE_MONTHLY_SEARCH_CREDITS,
    availabilityRate:AVAILABILITY_RESERVE_RATE,availabilityHours:AVAILABILITY_DURATION_HOURS,currency:"NGN",groups:GROUPS,intents:INTENTS});
  }
  if(pathname==="/api/early-access"&&request.method==="POST")return registerEarlyAccess(request,env);
  if(pathname==="/api/telegram/webhook"&&request.method==="POST"){
   try{return await handleTelegram(env,request);}
   catch(e){console.error(JSON.stringify({event:"telegram_webhook_error",reason:String((e as Error)?.message||"unknown")}));return err(503,"Temporary error.");}
  }
  if(pathname.startsWith("/api/"))return err(404,"API route not found.");
  return env.ASSETS.fetch(request);
 }
} satisfies ExportedHandler<Env>;
