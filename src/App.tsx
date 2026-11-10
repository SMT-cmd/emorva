import {useEffect,useRef,useState,type FormEvent} from "react";
import {GROUPS,INTENTS,type ConnectionIntent,type GroupId} from "../shared/catalog";
const money=(n:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(n);
const Chevron=({right=true}:{right?:boolean})=><span aria-hidden="true">{right?"↗":"↘"}</span>;
function Mark(){return <span className="brand-mark" aria-hidden="true">e</span>}
function Header(){
 const [open,setOpen]=useState(false);
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[]);
 return <header className="site-header" id="top"><nav className="nav wrap" aria-label="Main navigation">
  <a href="#top" className="brand" aria-label="Emorva home" onClick={()=>setOpen(false)}><Mark/><span>emorva<span className="brand-dot">.</span></span></a>
  <div className={"nav-links"+(open?" open":"")} id="nav-links">{[
   ["#discover","Discover"],["#how","How it works"],["#creators","For creators"],["#safety","Trust & privacy"],["#faq","FAQs"]
  ].map(([href,label])=><a href={href} key={href} onClick={()=>setOpen(false)}>{label}</a>)}</div>
  <div className="nav-actions"><a className="nav-text" href="#early-access">Early access</a><a className="btn btn-rose btn-small" href="#discover">Find your connection <Chevron/></a>
   <button type="button" className="menu-toggle" aria-label={open?"Close menu":"Open menu"} aria-expanded={open} aria-controls="nav-links" onClick={()=>setOpen(x=>!x)}><span/><span/><span/></button>
  </div></nav></header>;
}
function Hero(){return <section className="hero" aria-labelledby="hero-title">
 <div className="hero-photo" role="img" aria-label="Two adult African people sharing a quiet romantic moment"/><div className="hero-shade"/>
 <div className="hero-inner wrap"><div className="hero-copy"><div className="eyebrow light"><span className="spark">✦</span> A new way to meet, made for real people</div>
  <h1 id="hero-title">Where <em>chemistry</em> begins.</h1>
  <p>Friendship, sparks, something serious—or simply someone who understands you. Your kind of connection starts here.</p>
  <div className="hero-buttons"><a className="btn btn-rose" href="#discover">Explore connections <Chevron/></a><a className="btn btn-ghost" href="#how">See how it works <Chevron right={false}/></a></div>
  <div className="hero-foot"><span>18+ adults only</span><span className="tiny-divider"/><span>Mutual introductions</span><span className="tiny-divider"/><span>Privacy first</span></div>
 </div></div><div className="hero-bottom"/></section>}
function Discover(){
 const [active,setActive]=useState<GroupId>("dating");
 const [selected,setSelected]=useState<ConnectionIntent|null>(null);
 const modal=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(selected)modal.current?.showModal();else modal.current?.close()},[selected]);
 return <section className="discover section-pad" id="discover" aria-labelledby="discover-title"><div className="wrap">
  <div className="section-heading"><div><div className="section-kicker">CHOOSE YOUR JOURNEY</div><h2 id="discover-title">What kind of <em>connection</em> calls to you?</h2></div>
    <p>Follow your curiosity. Choose your intention, and see the proposed introduction fee before you commit.</p></div>
  <div className="category-tabs" role="tablist" aria-label="Connection categories">{GROUPS.map(g=><button className="tab" role="tab" id={"tab-"+g.id} aria-selected={g.id===active} aria-controls="connection-panel" key={g.id} onClick={()=>setActive(g.id)}>{g.label}</button>)}</div>
  <div className="category-panel" id="connection-panel" role="tabpanel" aria-labelledby={"tab-"+active}>{INTENTS.filter(i=>i.group===active).map(intent=><button className="intent-card" key={intent.id} onClick={()=>setSelected(intent)}>
    <span className="intent-icon" aria-hidden="true">{intent.icon}</span><h3>{intent.label}</h3><p>{intent.description}</p>
    <div className="intent-card-bottom"><span className="intent-price">{money(intent.feeNgn)}</span><span className="intent-arrow" aria-hidden="true">↗</span></div>
  </button>)}</div>
  <p className="pricing-note">Fees shown are planning prices for optional mutual introductions—not payments for intimacy, dates or guaranteed meetings. This service is in development.</p>
 </div><dialog className="intent-dialog" ref={modal} onClose={()=>setSelected(null)} onClick={e=>{if(e.target===modal.current)setSelected(null)}}>
   <div className="dialog-inner"><button className="dialog-close" aria-label="Close" onClick={()=>setSelected(null)}>×</button>
     <div className="section-kicker">YOUR KIND OF CONNECTION</div><h2>{selected?.label}</h2><p>{selected?.description}</p>
     <div className="dialog-fee"><span>Proposed introduction fee</span><strong>{selected?money(selected.feeNgn):""}</strong></div>
     <p className="dialog-note">Matching isn't active yet. No payment or introduction is due.</p><a href="#early-access" className="btn btn-rose" onClick={()=>setSelected(null)}>Get early access <Chevron/></a>
   </div></dialog>
 </section>;
}
function How(){return <section className="story section-pad" id="how"><div className="wrap story-grid">
 <div className="story-visual"><div className="story-photo" role="img" aria-label="An adult African woman smiling in an elegant velvet lounge"/><div className="story-caption"><span className="inline-mark" aria-hidden="true">♡</span><div><strong>On your terms.</strong><span>Real choice. Real boundaries.</span></div></div></div>
 <div className="story-copy"><div className="section-kicker">INTRODUCTIONS, REIMAGINED</div><h2>Two people. <em>One mutual yes.</em></h2><p>Our matchmaking assistant is designed to make introductions feel natural, respectful and simple.</p>
 <div className="steps">{[
  ["01","Tell us what feels right.","Choose interests, relationship intentions and an approximate location."],
  ["02","Meet compatible people.","Find opted-in adults with similar goals and a reason to connect."],
  ["03","Make it mutual.","Both people agree before private contact details are released."]
 ].map(([number,title,description])=><div className="step" key={number}><span className="step-num">{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}</div>
 <a className="text-link" href="#early-access">Be first to experience Emorva <Chevron/></a></div></div></section>}
function Trust(){const cards=[
 ["✧","Adults-only community","Age assurance before adult matchmaking, with optional stronger identity verification."],
 ["♡","Mutual introductions","Both people choose whether to connect. No payment can buy another person's consent."],
 ["◈","Private by choice","Control discovery, approved media, sharing, blocks and reports."],
 ["↺","Credit protection","Transparent fees and proposed 24-hour availability reservations."]
 ];return <section className="trust section-pad" id="safety"><div className="wrap"><div className="trust-top"><div className="section-kicker">TRUST IS ATTRACTIVE</div><h2>Comfortable enough <em>to be yourself.</em></h2><p>Honest intentions, good boundaries and clear choices make better connections possible.</p></div><div className="trust-grid">{cards.map(([icon,title,body])=><article className="trust-card" key={title}><span className="trust-icon" aria-hidden="true">{icon}</span><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>}
function Creators(){return <section className="creators section-pad" id="creators"><div className="wrap creators-layout"><div className="creators-copy"><div className="section-kicker light">EXPRESS YOURSELF</div><h2>More than meeting. <em>Make your mark.</em></h2><p>Emorva is growing into a place where adults can share moments, discover creators and connect through shared interests.</p><div className="feature-pills"><span>Stories & moments</span><span>Creator communities</span><span>Future live experiences</span></div><a href="#early-access" className="btn btn-rose">Join the first community <Chevron/></a></div><div className="creators-photo" role="img" aria-label="African adult creator in a burgundy lounge"/></div></section>}
function FAQ(){const questions=[
 ["Is Emorva live yet?","Emorva is in development. We aren't accepting matchmaking payments or sharing member contacts yet."],
 ["Can I use Emorva through Telegram?","Yes. The planned Telegram assistant will help adults browse categories, search, express interest and receive privacy-respecting updates."],
 ["Do I need to verify my identity?","Age assurance is required before accessing adult matching. Enhanced identity verification is a separate trust tier unless specific activities require it."],
 ["What are connection fees for?","They pay for a disclosed introduction service—not sex, a date, consent or a guaranteed meeting. Paid features require payment-provider approval."]
 ];return <section className="faq section-pad" id="faq"><div className="wrap faq-layout"><div><div className="section-kicker">THE LITTLE DETAILS</div><h2>Good questions, <em>clear answers.</em></h2></div><div className="faq-items">{questions.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div></section>}
function EarlyAccess(){
 const [email,setEmail]=useState("");const [message,setMessage]=useState("Adults 18+ only. Product updates; unsubscribe anytime.");const [loading,setLoading]=useState(false);
 const submit=async(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault();if(loading)return;setLoading(true);
  try{const response=await fetch("/api/early-access",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:email.trim(),consent:true})});
    const data:unknown=await response.json();if(!response.ok)throw new Error(typeof data==="object"&&data!==null&&"error" in data?String((data as {error:unknown}).error):"Unable to save your request.");
    setEmail("");setMessage("Thanks! You're on the early-access list.");
  }catch(e){setMessage(e instanceof Error?e.message:"Please try again later.");}finally{setLoading(false);}
 };
 return <section className="closing" id="early-access"><div className="closing-photo" role="img" aria-label="Two adult African people sharing a tender romantic moment"/><div className="closing-shade"/>
  <div className="closing-content wrap"><div className="section-kicker light">THE BEGINNING OF SOMETHING GOOD</div><h2>Some connections <em>change everything.</em></h2><p>Be part of Emorva from the beginning.</p>
   <form className="notify-form" onSubmit={submit}><label htmlFor="notify-email" className="sr-only">Email address</label><input id="notify-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} maxLength={254} autoComplete="email" placeholder="Your email address" required/><button disabled={loading} type="submit">{loading?"Submitting…":"Join early access ↗"}</button></form>
   <p className="form-note" role="status">{message}</p>
  </div></section>;
}
function Footer(){return <footer className="footer"><div className="wrap footer-grid"><div><a className="brand" href="#top"><Mark/><span>emorva<span className="brand-dot">.</span></span></a><p>Where chemistry begins.</p></div><div className="footer-links">{[["#discover","Discover"],["#how","How it works"],["#safety","Safety"],["#early-access","Early access"]].map(([href,label])=><a key={href} href={href}>{label}</a>)}</div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Emorva. All rights reserved.</span><span>Made for connections. Built for consent.</span></div></footer>}
export default function App(){return <><a className="skip" href="#main">Skip to content</a><Header/><main id="main"><Hero/><section className="intro wrap"><div className="section-kicker">MORE THAN ANOTHER SWIPE</div><div className="intro-content"><h2>A little curiosity. <em>A real connection.</em></h2><p>Beautiful encounters begin with understanding what matters to you. Emorva helps consenting adults find people with compatible intentions—without exposing private details before both say yes.</p></div><div className="intro-ornament" aria-hidden="true">e</div></section><Discover/><How/><Trust/><Creators/><FAQ/><EarlyAccess/></main><Footer/></>}
