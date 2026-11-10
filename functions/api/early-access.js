const MAX_BODY = 2048;
const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
function fail(status,error){return Response.json({error},{status,headers:{"cache-control":"no-store"}});}
async function hashIp(ip,salt,date){
 const bytes=new TextEncoder().encode(salt+":"+date+":"+ip);
 const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",bytes));
 return Array.from(digest,b=>b.toString(16).padStart(2,"0")).join("");
}
export async function onRequestPost({request,env}){
 if(env.WAITLIST_ENABLED!=="true")return fail(503,"Early access is being configured. Please check back soon.");
 if(!env.DB||!env.RATE_LIMIT_SALT)return fail(503,"Early access is temporarily unavailable.");
 const origin=request.headers.get("origin");
 if(origin&&origin!==new URL(request.url).origin)return fail(403,"Invalid request origin.");
 if(!(request.headers.get("content-type")||"").includes("application/json"))return fail(415,"Expected JSON.");
 if(Number(request.headers.get("content-length")||"0")>MAX_BODY)return fail(413,"Request too large.");
 let payload;
 try{const raw=await request.text();if(raw.length>MAX_BODY)return fail(413,"Request too large.");payload=JSON.parse(raw);}
 catch{return fail(400,"Invalid request.");}
 if(typeof payload.email!=="string"||payload.email.length>254||!emailPattern.test(payload.email.trim())||payload.consent!==true)return fail(400,"Enter a valid email and agree to receive updates.");
 const email=payload.email.trim().toLowerCase();
 const ip=request.headers.get("cf-connecting-ip")||"local";
 const date=new Date().toISOString().slice(0,10);
 const ipHash=await hashIp(ip,env.RATE_LIMIT_SALT,date);
 try{
  const current=await env.DB.prepare("SELECT submissions FROM early_access_rate WHERE id = ?").bind(ipHash).first();
  if(current&&current.submissions>=5)return fail(429,"Too many requests from this network today.");
  await env.DB.prepare("INSERT INTO early_access (email,consent_at) VALUES (?,datetime('now')) ON CONFLICT(email) DO NOTHING").bind(email).run();
  await env.DB.prepare("INSERT INTO early_access_rate (id,submissions,day) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET submissions = submissions + 1").bind(ipHash,date).run();
  return Response.json({ok:true,message:"You're on the list."},{headers:{"cache-control":"no-store"}});
 }catch(error){
  console.error(JSON.stringify({event:"early_access_failed",message:String(error?.message||"database error")}));
  return fail(503,"Early access is temporarily unavailable.");
 }
}
export async function onRequestGet(){return fail(405,"Method not allowed.");}
