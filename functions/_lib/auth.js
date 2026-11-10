// Signed Telegram Mini App login. Never trust client-supplied Telegram identity.
const encode=new TextEncoder();
export class ApiError extends Error{constructor(status,message){super(message);this.status=status}}
const reject=(status,message)=>{throw new ApiError(status,message)};
async function mac(key,msg){const k=await crypto.subtle.importKey("raw",key,{name:"HMAC",hash:"SHA-256"},false,["sign"]);return new Uint8Array(await crypto.subtle.sign("HMAC",k,encode.encode(msg)))}
const hex=x=>Array.from(x,b=>b.toString(16).padStart(2,"0")).join("");
function same(a,b){if(!/^[a-f0-9]{64}$/.test(a||"")||b.length!==64)return false;let v=0;for(let i=0;i<64;i++)v|=a.charCodeAt(i)^b.charCodeAt(i);return v===0}
export async function authenticate(request,env){
 const header=request.headers.get("authorization")||"";
 if(!header.startsWith("tma ")||header.length>8196)reject(401,"Open Emorva through Telegram to sign in.");
 if(!env.TELEGRAM_BOT_TOKEN)reject(503,"Telegram authentication is not configured.");
 const qs=new URLSearchParams(header.slice(4)),hash=qs.get("hash"),date=Number(qs.get("auth_date")),now=Math.floor(Date.now()/1000);
 if(!Number.isSafeInteger(date)||date<now-86400||date>now+60)reject(401,"Session expired. Reopen the Mini App.");
 const pairs=[...qs.entries()].filter(([k])=>k!=="hash"&&k!=="signature").map(([k,v])=>k+"="+v).sort();
 const key=await mac(encode.encode("WebAppData"),env.TELEGRAM_BOT_TOKEN);
 if(!same(hash,hex(await mac(key,pairs.join("\n")))))reject(401,"Invalid Telegram signature.");
 let user;try{user=JSON.parse(qs.get("user")||"null")}catch{reject(401,"Invalid Telegram profile")}
 if(!user||!Number.isSafeInteger(user.id)||user.id<=0)reject(401,"Invalid member.");
 return {telegramId:String(user.id),name:String(user.first_name||"").slice(0,70)};
}
export function responseError(e){return Response.json({error:e instanceof ApiError?e.message:"Service temporarily unavailable."},{status:e instanceof ApiError?e.status:503,headers:{"cache-control":"no-store"}})}
export async function bodyJson(request,max=3500){
 if(!(request.headers.get("content-type")||"").startsWith("application/json"))reject(415,"Expected JSON.");
 if(Number(request.headers.get("content-length")||"0")>max)reject(413,"Request too large.");
 const raw=await request.text();if(raw.length>max)reject(413,"Request too large.");
 let v;try{v=JSON.parse(raw)}catch{reject(400,"Invalid JSON")}
 if(!v||Array.isArray(v)||typeof v!=="object")reject(400,"Expected an object.");
 return v;
}