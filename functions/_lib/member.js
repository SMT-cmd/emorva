import {authenticate,ApiError} from "./auth.js";
export async function memberSession(request,env){
 if(!env.DB)throw new ApiError(503,"Member database unavailable.");
 const identity=await authenticate(request,env);
 await env.DB.prepare("INSERT OR IGNORE INTO members (id,telegram_user_id) VALUES (?,?)").bind(crypto.randomUUID(),identity.telegramId).run();
 const member=await env.DB.prepare("SELECT * FROM members WHERE telegram_user_id=?").bind(identity.telegramId).first();
 if(!member||member.status==="suspended"||member.status==="deleted")throw new ApiError(403,"Account unavailable.");
 await env.DB.prepare("INSERT OR IGNORE INTO wallets (id,member_id,kind,currency,balance,reserved) VALUES (?,?,'search','SEARCH',100,0)").bind("search:"+member.id,member.id).run();
 const period=new Date().toISOString().slice(0,7);
 const grant=await env.DB.prepare("INSERT OR IGNORE INTO monthly_search_grants(member_id,period) VALUES (?,?)").bind(member.id,period).run();
 if(grant.meta?.changes===1)await env.DB.batch([
  env.DB.prepare("UPDATE wallets SET balance=100 WHERE member_id=? AND kind='search'").bind(member.id),
  env.DB.prepare("INSERT OR IGNORE INTO ledger_entries(id,wallet_id,amount,source,idempotency_key) VALUES (?,?,?,?,?)").bind(crypto.randomUUID(),"search:"+member.id,100,"monthly_search","monthly:"+member.id+":"+period)
 ]);
 return member;
}
export function requireAssured(member){if(member.status!=="active"||member.adult_assurance_status!=="passed")throw new ApiError(403,"Adult-age assurance is required before matching.")}
