import {memberSession} from "../_lib/member.js";
import {bodyJson,ApiError,responseError} from "../_lib/auth.js";
import {CATALOG} from "../_lib/catalog.js";
const valid=new Set(CATALOG.map(x=>x.id));
const reply=x=>Response.json(x,{headers:{"cache-control":"no-store"}});
export async function onRequestGet({request,env}){
 try{
  const m=await memberSession(request,env);
  const [profile,intents,wallets]=await Promise.all([
   env.DB.prepare("SELECT public_name,age_years,city,area,bio,visibility,permits_invites FROM member_profiles WHERE member_id=?").bind(m.id).first(),
   env.DB.prepare("SELECT intent_id FROM member_intents WHERE member_id=? AND enabled=1").bind(m.id).all(),
   env.DB.prepare("SELECT kind,currency,balance,reserved FROM wallets WHERE member_id=?").bind(m.id).all()
  ]);
  return reply({id:m.id,status:m.status,ageAssurance:m.adult_assurance_status,identityVerification:m.identity_status,profile:profile||null,intents:(intents.results||[]).map(x=>x.intent_id),wallets:wallets.results||[]});
 }catch(e){return responseError(e)}
}
export async function onRequestPost({request,env}){
 try{
  const m=await memberSession(request,env),data=await bodyJson(request);
  const name=String(data.name||"").trim(),city=String(data.city||"").trim(),area=String(data.area||"").trim(),bio=String(data.bio||"").trim(),age=Number(data.age);
  if(name.length<2||name.length>40||city.length<2||city.length>60||area.length>60||bio.length>400||!Number.isInteger(age)||age<18||age>99)throw new ApiError(400,"Enter a valid adult age, name and city.");
  if(!Array.isArray(data.intents)||data.intents.length>8||data.intents.some(x=>typeof x!=="string"||!valid.has(x)))throw new ApiError(400,"Choose valid connection intentions.");
  // Self-declared ages and purchased credits never count as verification.
  const publish=m.status==="active"&&m.adult_assurance_status==="passed"&&data.discoverable===true;
  await env.DB.batch([
   env.DB.prepare("INSERT INTO member_profiles (member_id,public_name,age_years,city,area,bio,visibility,permits_invites) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(member_id) DO UPDATE SET public_name=excluded.public_name,age_years=excluded.age_years,city=excluded.city,area=excluded.area,bio=excluded.bio,visibility=excluded.visibility,permits_invites=excluded.permits_invites,updated_at=datetime('now')").bind(m.id,name,age,city,area,bio,publish?"discovery":"hidden",publish?1:0),
   env.DB.prepare("DELETE FROM member_intents WHERE member_id=?").bind(m.id),
   ...[...new Set(data.intents)].map(x=>env.DB.prepare("INSERT INTO member_intents(member_id,intent_id) VALUES (?,?)").bind(m.id,x))
  ]);
  return reply({ok:true,discoverable:publish,needsAgeAssurance:m.adult_assurance_status!=="passed"});
 }catch(e){return responseError(e)}
}
