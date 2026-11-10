import {CATALOG} from "../../_lib/catalog.js";
const GROUPS=[
 {id:"social",label:"Friendship & Social",items:["friends","activity","study","gaming"]},
 {id:"romance",label:"Dating & Romance",items:["casual","serious","private","marriage"]},
 {id:"adult",label:"Adult Connections",items:["fwb","noncommercial"]},
 {id:"fitness",label:"Activities & Fitness",items:["jog","gym","travel","event"]},
 {id:"creators",label:"Creators & Networking",items:["creator"]}
];
const ngn=new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0});
function keyboard(rows){return {inline_keyboard:rows};}
function btn(text,callback_data){return {text,callback_data};}
async function telegram(env,method,body){
 const res=await fetch("https://api.telegram.org/bot"+env.TELEGRAM_BOT_TOKEN+"/"+method,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
 if(!res.ok)console.error(JSON.stringify({event:"telegram_error",method,status:res.status}));
 return res.ok;
}
async function send(env,chatId,text,replyMarkup){
 return telegram(env,"sendMessage",{chat_id:chatId,text,reply_markup:replyMarkup,disable_web_page_preview:true});
}
function menu(){
 return keyboard([...GROUPS.map(group=>[btn(group.label,"group:"+group.id)]),[btn("How Emorva works","about")]]);
}
function infoFor(id){
 const item=CATALOG.find(x=>x.id===id);
 return item||null;
}
async function handleCallback(env,callback){
 const chatId=callback.message?.chat?.id;
 if(!chatId)return;
 await telegram(env,"answerCallbackQuery",{callback_query_id:callback.id});
 const data=callback.data||"";
 if(data==="back"){await send(env,chatId,"What kind of connection would you like to explore?",menu());return;}
 if(data==="about"){
  await send(env,chatId,"Emorva — Where chemistry begins.\n\nOur adult-only matching service is being built. Members will search using a free monthly allowance, and both people must agree before an introduction. We are NOT accepting payments or sharing contacts yet.",keyboard([[btn("Explore categories","back")]]));return;
 }
 if(data.startsWith("group:")){
  const group=GROUPS.find(x=>x.id===data.slice(6));
  if(!group)return;
  const options=group.items.map(id=>{
    const x=infoFor(id);return [btn(x.label+" · "+ngn.format(x.ngn),"intent:"+id)];
  });
  options.push([btn("‹ Back to categories","back")]);
  await send(env,chatId,group.label+"\n\nChoose an intention to learn more:",keyboard(options));return;
 }
 if(data.startsWith("intent:")){
  const intent=infoFor(data.slice(7));
  if(!intent)return;
  await send(env,chatId,intent.label+"\nProposed introduction fee: "+ngn.format(intent.ngn)+"\n\nThis fee is for an optional mutual introduction, not a guaranteed meeting or another person's consent. Matching is not yet live and no payment is due.",keyboard([[btn("‹ Choose another","back")]]));return;
 }
}
export async function onRequestPost({request,env}){
 if(!env.TELEGRAM_BOT_TOKEN||!env.TELEGRAM_WEBHOOK_SECRET)return Response.json({error:"Bot not configured"},{status:503});
 const actual=request.headers.get("X-Telegram-Bot-Api-Secret-Token")||"";
 if(actual!==env.TELEGRAM_WEBHOOK_SECRET)return new Response("Forbidden",{status:403});
 if(Number(request.headers.get("content-length")||"0")>200000)return new Response("Too large",{status:413});
 let data;
 try{data=await request.json();}
 catch{return new Response("Invalid JSON",{status:400});}
 try{
  if(data.callback_query)await handleCallback(env,data.callback_query);
  else if(data.message?.chat?.id){
   const chatId=data.message.chat.id;const userText=(data.message.text||"").trim();
   if(userText==="/start"||userText==="/help"||!userText){
    await send(env,chatId,"Welcome to Emorva ♡\nWhere chemistry begins.\n\nExplore our connection types below. Private matchmaking is coming soon. Adults 18+ only.",menu());
   }else{
    await send(env,chatId,"Thanks for reaching out. Automated matching is not live yet. For now, explore the categories and proposed prices below.",menu());
   }
  }
  return new Response("OK",{status:200});
 }catch(error){
  console.error(JSON.stringify({event:"telegram_webhook_failure",message:String(error?.message||"unknown")}));
  return new Response("Temporary error",{status:503});
 }
}
export async function onRequestGet(){return new Response("Method not allowed",{status:405});}
