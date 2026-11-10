import {useEffect,useMemo,useState,type FormEvent} from "react";
import {GROUPS,INTENTS,type GroupId} from "../shared/catalog";
import "./members.css";
type Member={id:string;status:string;ageAssurance:string;identityVerification:string;profile:{public_name?:string;age_years?:number;city?:string;area?:string;bio?:string;visibility?:string}|null;intents:string[];wallets:{kind:string;balance:number;reserved:number}[]};
type Result={id:string;name:string;age:number;city:string;bio:string;identityStatus:string};
type Intro={id:string;intent_id:string;state:string;direction:string;created_at:string};
declare global {interface Window {Telegram?:{WebApp?:{initData?:string;ready?:()=>void;expand?:()=>void}}}}
function authHeaders(init:string){return {"authorization":"tma "+init,"content-type":"application/json"}}
const fmt=(x:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(x);
export default function MemberSpace(){
 const init=window.Telegram?.WebApp?.initData||"";
 const [member,setMember]=useState<Member|null>(null),[status,setStatus]=useState(init?"Loading your account…":"Open Emorva inside Telegram to link your account.");
 const [name,setName]=useState(""),[age,setAge]=useState(""),[city,setCity]=useState(""),[area,setArea]=useState(""),[bio,setBio]=useState("");
 const [intentIds,setIntentIds]=useState<string[]>([]),[discoverable,setDiscoverable]=useState(false),[group,setGroup]=useState<GroupId>("dating");
 const [tab,setTab]=useState<"profile"|"discover"|"requests">("profile"),[results,setResults]=useState<Result[]>([]),[requests,setRequests]=useState<Intro[]>([]);
 const [targetIntent,setTargetIntent]=useState("casual"),[searchCity,setSearchCity]=useState(""),[minAge,setMinAge]=useState(22),[maxAge,setMaxAge]=useState(40),[busy,setBusy]=useState(false);
 const canMatch=member?.status==="active"&&member?.ageAssurance==="passed";
 const credit=member?.wallets.find(x=>x.kind==="search")?.balance??0;
 const selectedIntent=useMemo(()=>INTENTS.find(x=>x.id===targetIntent),[targetIntent]);
 const load=async()=>{
  const r=await fetch("/api/me",{headers:authHeaders(init)});const body=await r.json() as Member&{error?:string};
  if(!r.ok)throw new Error(body.error||"Unable to load account");
  setMember(body);setName(body.profile?.public_name||"");setAge(String(body.profile?.age_years||""));setCity(body.profile?.city||"");setArea(body.profile?.area||"");setBio(body.profile?.bio||"");
  setSearchCity(body.profile?.city||"");setIntentIds(body.intents||[]);setDiscoverable(body.profile?.visibility==="discovery");
  setStatus(body.ageAssurance==="passed"?"Account ready":"Complete age assurance before profiles become discoverable.");
 };
 useEffect(()=>{if(!init)return;window.Telegram?.WebApp?.ready?.();window.Telegram?.WebApp?.expand?.();void load().catch(e=>setStatus(e instanceof Error?e.message:"Unable to load"));},[init]);
 const submit=async(e:FormEvent)=>{e.preventDefault();if(!init||busy)return;setBusy(true);setStatus("Saving your profile…");
  try{const r=await fetch("/api/me",{method:"POST",headers:authHeaders(init),body:JSON.stringify({name,age:Number(age),city,area,bio,intents:intentIds,discoverable})});
    const body=await r.json() as {error?:string};if(!r.ok)throw new Error(body.error||"Unable to save");
    await load();setStatus("Profile saved securely.");}
  catch(e){setStatus(e instanceof Error?e.message:"Unable to save")}finally{setBusy(false)}
 };
 const search=async(e:FormEvent)=>{e.preventDefault();if(!canMatch||busy)return;setBusy(true);setStatus("Searching compatible members…");
  try{const r=await fetch("/api/search",{method:"POST",headers:{...authHeaders(init),"Idempotency-Key":crypto.randomUUID()},body:JSON.stringify({intent:targetIntent,city:searchCity,minAge,maxAge})});
   const data=await r.json() as {matches?:Result[];error?:string;creditsUsed?:number;message?:string};
   if(!r.ok)throw new Error(data.error||"Search unavailable");setResults(data.matches||[]);
   setStatus(data.message||"Search complete");await load();}
  catch(e){setStatus(e instanceof Error?e.message:"Search unavailable")}finally{setBusy(false)}
 };
 const requestIntro=async(candidate:Result)=>{if(!canMatch||busy)return;setBusy(true);
  try{const r=await fetch("/api/introductions",{method:"POST",headers:authHeaders(init),body:JSON.stringify({recipientId:candidate.id,intent:targetIntent})});
   const data=await r.json() as {error?:string};if(!r.ok)throw new Error(data.error||"Request failed");
   setStatus("Your interest request is saved. No payment or contact exchange has occurred.");}
  catch(e){setStatus(e instanceof Error?e.message:"Request failed")}finally{setBusy(false)}
 };
 const loadRequests=async()=>{setTab("requests");if(!canMatch)return;try{const r=await fetch("/api/introductions",{headers:authHeaders(init)});const d=await r.json() as {requests?:Intro[]};if(r.ok)setRequests(d.requests||[])}catch{}};
 return <main className="member-app">
  <header className="member-header"><a className="member-brand" href="/"><img src="/assets/emorva-mark.png" alt="" width="34" height="34"/>emorva<span>.</span></a><span>Where chemistry begins.</span></header>
  <section className="member-head"><div><p className="member-kicker">YOUR PRIVATE SPACE</p><h1>Connections, on <em>your terms.</em></h1><p>Your profile, preferences and mutual introductions—thoughtfully in one place.</p></div><div className="member-balance"><small>Monthly search credits</small><strong>{init?credit:"—"}</strong><span>Free credits · never cash</span></div></section>
  {!init?<section className="member-panel"><h2>Connect your Telegram account</h2><p>For account security, this space opens inside the official Emorva Telegram Mini App. An ordinary website link does not authenticate you automatically.</p><a className="member-primary" href="/">Return to Emorva</a></section>:
  <><p role="status" className="member-status">{status}</p>
  <nav aria-label="Member space" className="member-tabs"><button className={tab==="profile"?"active":""} onClick={()=>setTab("profile")}>My profile</button><button className={tab==="discover"?"active":""} onClick={()=>setTab("discover")}>Discover</button><button className={tab==="requests"?"active":""} onClick={()=>void loadRequests()}>Introductions</button></nav>
  {tab==="profile"&&<section className="member-panel"><div className="member-panel-head"><div><p className="member-kicker">A GOOD FIRST IMPRESSION</p><h2>Your profile</h2></div><span className="member-verification">{member?.identityVerification==="verified"?"Identity verified":"Identity check optional"}</span></div>
  <p className="member-note">Your displayed age is self-reported until adult-age assurance is completed. We don't publish unverified profiles.</p>
  <form onSubmit={submit} className="member-form"><label>Display name<input required minLength={2} maxLength={40} value={name} onChange={e=>setName(e.target.value)} placeholder="What should we call you?"/></label>
  <div className="member-two"><label>Age<input required type="number" min={18} max={99} value={age} onChange={e=>setAge(e.target.value)}/></label><label>City<input required value={city} maxLength={60} onChange={e=>setCity(e.target.value)} placeholder="Lagos"/></label></div>
  <label>Area (optional)<input value={area} maxLength={60} onChange={e=>setArea(e.target.value)} placeholder="Ikeja"/></label>
  <label>About you<textarea value={bio} onChange={e=>setBio(e.target.value)} maxLength={400} placeholder="Your interests and what makes a great connection…"/></label>
  <h3>What connections interest you?</h3><div className="member-group-tabs">{GROUPS.map(g=><button type="button" className={group===g.id?"active":""} onClick={()=>setGroup(g.id)} key={g.id}>{g.label}</button>)}</div>
  <div className="member-options">{INTENTS.filter(i=>i.group===group).map(i=><label key={i.id}><input type="checkbox" checked={intentIds.includes(i.id)} onChange={e=>setIntentIds(old=>e.target.checked?[...old,i.id]:old.filter(x=>x!==i.id))}/><span>{i.label}</span></label>)}</div>
  <label className="member-discovery"><input type="checkbox" checked={discoverable} onChange={e=>setDiscoverable(e.target.checked)}/><span>Let eligible adults discover my profile after age assurance.</span></label>
  <button className="member-primary" disabled={busy} type="submit">Save profile</button></form>
  {!canMatch&&<p className="member-alert">Full matching stays locked until adult-age assurance is completed through an approved identity provider. Paying a fee cannot replace this check.</p>}
  </section>}
  {tab==="discover"&&<section className="member-panel"><p className="member-kicker">FIND SOMEONE</p><h2>A little curiosity. A real connection.</h2><p className="member-note">Search for people who opted in to the same intention. Only approved adult profiles appear.</p>
   <form className="member-form" onSubmit={search}><label>Connection type<select value={targetIntent} onChange={e=>setTargetIntent(e.target.value)}>{GROUPS.map(g=><optgroup key={g.id} label={g.label}>{INTENTS.filter(i=>i.group===g.id).map(i=><option key={i.id} value={i.id}>{i.label}</option>)}</optgroup>)}</select></label>
   <div className="member-two"><label>City<input required value={searchCity} onChange={e=>setSearchCity(e.target.value)} maxLength={60}/></label><label>Age from<input type="number" min={18} max={99} value={minAge} onChange={e=>setMinAge(Number(e.target.value))}/></label></div><label>Age to<input type="number" min={18} max={99} value={maxAge} onChange={e=>setMaxAge(Number(e.target.value))}/></label>
   <p className="member-note">Proposed introduction fee: <strong>{selectedIntent?fmt(selectedIntent.feeNgn):"—"}</strong>. No paid introductions are enabled yet. Searches cost 5 free credits only when results are found.</p><button className="member-primary" disabled={!canMatch||busy}>Find compatible people</button></form>
   <div className="member-results">{results.map(r=><article key={r.id}><h3>{r.name}, {r.age}</h3><p>{r.city} · {r.identityStatus==="verified"?"Identity verified":"Identity not verified"}</p><p>{r.bio}</p><button type="button" disabled={!canMatch||busy} onClick={()=>void requestIntro(r)}>Express interest</button></article>)}</div>
  </section>}
  {tab==="requests"&&<section className="member-panel"><p className="member-kicker">YOUR CONNECTIONS</p><h2>Mutual introductions</h2><p className="member-note">This screen tracks requests only. Contact release and payment are disabled until consent and checkout integrations are ready.</p>
    {requests.length?requests.map(r=><div className="member-request" key={r.id}><strong>{INTENTS.find(i=>i.id===r.intent_id)?.label||r.intent_id}</strong><span>{r.direction} · {r.state}</span></div>):<p className="member-note">No introductions yet.</p>}
   </section>}
  </>}
  <footer className="member-footer">Emorva · Adults 18+ · Privacy by design · <a href="/">Home</a></footer>
 </main>;
}
