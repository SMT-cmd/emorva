import {memberSession,requireAssured} from "../_lib/member.js";
import {bodyJson,ApiError,responseError} from "../_lib/auth.js";
import {getIntent} from "../_lib/catalog.js";
const reply=x=>Response.json(x,{headers:{"cache-control":"no-store"}});
export async function onRequestPost({request,env}){
 try{
  const m=await memberSession(request,env);requireAssured(m);
  const data=await bodyJson(request),intent=String(data.intent||""),city=String(data.city||"").trim(),minAge=Number(data.minAge||18),maxAge=Number(data.maxAge||80);
  if(!getIntent(intent)||city.length<2||city.length>60||!Number.isInteger(minAge)||!Number.isInteger(maxAge)||minAge<18||maxAge>99||minAge>maxAge)throw new ApiError(400,"Invalid search filters.");
  const key=String(request.headers.get("idempotency-key")||"");
  if(!/^[a-zA-Z0-9-]{16,80}$/.test(key))throw new ApiError(400,"Search request ID required.");
  const cached=await env.DB.prepare("SELECT results_json,units FROM search_requests WHERE id=? AND member_id=?").bind(key,m.id).first();
  if(cached)return reply({matches:JSON.parse(cached.results_json),creditsUsed:cached.units,replayed:true});
  const found=await env.DB.prepare(`SELECT p.member_id id,p.public_name name,p.age_years age,p.city,p.bio,m.identity_status identityStatus
    FROM member_profiles p JOIN members m ON m.id=p.member_id
    JOIN member_intents i ON i.member_id=p.member_id AND i.intent_id=? AND i.enabled=1
    WHERE p.member_id<>? AND m.status='active' AND m.adult_assurance_status='passed'
    AND p.visibility='discovery' AND p.permits_invites=1 AND LOWER(p.city)=LOWER(?)
    AND p.age_years BETWEEN ? AND ? ORDER BY p.updated_at DESC LIMIT 5`).bind(intent,m.id,city,minAge,maxAge).all();
  const matches=(found.results||[]).map(x=>({id:x.id,name:x.name,age:x.age,city:x.city,bio:x.bio,identityStatus:x.identityStatus}));
  const cost=matches.length?5:0;
  const wallet=await env.DB.prepare("SELECT balance FROM wallets WHERE member_id=? AND kind='search'").bind(m.id).first();
  if(Number(wallet?.balance||0)<cost)throw new ApiError(402,"No free search credits remaining this month.");
  try{
    const result=await env.DB.batch([
      env.DB.prepare("INSERT INTO search_requests(id,member_id,intent_id,units,results_json) SELECT ?,?,?,?,? FROM wallets WHERE member_id=? AND kind='search' AND balance>=?").bind(key,m.id,intent,cost,JSON.stringify(matches),m.id,cost),
      env.DB.prepare("UPDATE wallets SET balance=balance-? WHERE member_id=? AND kind='search' AND EXISTS (SELECT 1 FROM search_requests WHERE id=? AND member_id=?) AND balance>=?").bind(cost,m.id,key,m.id,cost),
      env.DB.prepare("INSERT INTO ledger_entries(id,wallet_id,amount,source,idempotency_key,reference_id) SELECT ?,id,?,?,?,? FROM wallets WHERE member_id=? AND kind='search' AND EXISTS (SELECT 1 FROM search_requests WHERE id=? AND member_id=?)").bind(crypto.randomUUID(),-cost,"search","search:"+key,key,m.id,key,m.id)
    ]);
    if(result[0]?.meta?.changes!==1)throw new ApiError(402,"No credits remaining.");
  }catch(e){
    const old=await env.DB.prepare("SELECT results_json,units FROM search_requests WHERE id=? AND member_id=?").bind(key,m.id).first();
    if(old)return reply({matches:JSON.parse(old.results_json),creditsUsed:old.units,replayed:true});
    if(e instanceof ApiError)throw e;
    throw new ApiError(503,"Search temporarily unavailable.");
  }
  return reply({matches,creditsUsed:cost,message:matches.length?"Only opted-in adults appear in matching.":"No compatible profiles found; no credits charged."});
 }catch(e){return responseError(e)}
}
