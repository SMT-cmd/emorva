import {memberSession,requireAssured} from "../_lib/member.js";
import {bodyJson,ApiError,responseError} from "../_lib/auth.js";
import {getIntent} from "../_lib/catalog.js";
const reply=x=>Response.json(x,{headers:{"cache-control":"no-store"}});
export async function onRequestGet({request,env}){
 try{const m=await memberSession(request,env);requireAssured(m);
 const v=await env.DB.prepare("SELECT id,intent_id,state,created_at,expires_at,CASE WHEN requester_id=? THEN 'sent' ELSE 'received' END direction FROM introduction_requests WHERE requester_id=? OR recipient_id=? ORDER BY created_at DESC LIMIT 50").bind(m.id,m.id,m.id).all();
 return reply({requests:v.results||[]})}catch(e){return responseError(e)}
}
export async function onRequestPost({request,env}){
 try{
  const m=await memberSession(request,env);requireAssured(m);
  const data=await bodyJson(request),target=String(data.recipientId||""),intent=String(data.intent||"");
  if(!/^[a-f0-9-]{36}$/.test(target)||!getIntent(intent)||target===m.id)throw new ApiError(400,"Invalid introduction request.");
  const candidate=await env.DB.prepare("SELECT m.id FROM members m JOIN member_profiles p ON p.member_id=m.id JOIN member_intents i ON i.member_id=m.id AND i.intent_id=? AND i.enabled=1 WHERE m.id=? AND m.status='active' AND m.adult_assurance_status='passed' AND p.visibility='discovery' AND p.permits_invites=1").bind(intent,target).first();
  if(!candidate)throw new ApiError(404,"Recipient is not accepting invitations.");
  const prev=await env.DB.prepare("SELECT id FROM introduction_requests WHERE requester_id=? AND recipient_id=? AND intent_id=? AND state IN ('requested','recipient_accepted','both_accepted','pending_payment') LIMIT 1").bind(m.id,target,intent).first();
  if(prev)return reply({ok:true,id:prev.id,state:"requested",replayed:true});
  const id=crypto.randomUUID(),expiry=new Date(Date.now()+24*3600*1000).toISOString();
  await env.DB.prepare("INSERT INTO introduction_requests(id,requester_id,recipient_id,intent_id,state,requester_approved_at,expires_at) VALUES (?,?,?,?,'requested',datetime('now'),?)").bind(id,m.id,target,intent,expiry).run();
  return reply({ok:true,id,state:"requested",message:"Interest request saved. No money charged and no private contacts shared."});
 }catch(e){return responseError(e)}
}
