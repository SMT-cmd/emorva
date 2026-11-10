import {useEffect,useState,type FormEvent} from "react";
import {GROUPS,INTENTS,type GroupId} from "../shared/catalog";
import "./site.css";

const price=(n:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(n);
type Route="home"|"discover"|"how"|"safety"|"creators"|"about"|"privacy"|"terms"|"early";
const paths:Record<Route,string>={home:"/",discover:"/discover",how:"/how-it-works",safety:"/safety",creators:"/creators",about:"/about",privacy:"/privacy",terms:"/terms",early:"/early-access"};
const labels:Partial<Record<Route,string>>={home:"Home",discover:"Discover",how:"How it works",safety:"Safety",creators:"For creators",about:"Our story"};
function Brand({light=false}:{light?:boolean}){return <a className={"emorva-brand"+(light?" light":"")} href="/" aria-label="Emorva — home"><img className="ribbon-logo" src="/assets/emorva-mark.png" alt="" width="37" height="37"/><span>emorva<span className="brand-period">.</span></span></a>}
function Chevron(){return <span className="link-chevron" aria-hidden>↗</span>}
function Header({route}:{route:Route|"notFound"}){const [open,setOpen]=useState(false);return <header className="editorial-header"><div className="editorial-nav shell"><Brand/><nav className={open?"navigation expanded":"navigation"} aria-label="Primary navigation" id="emorva-navigation">{(["discover","how","safety","creators","about"] as Route[]).map(p=><a key={p} aria-current={route===p?"page":undefined} href={paths[p]} onClick={()=>setOpen(false)}>{labels[p]}</a>)}<a className="mobile-nav-only" href="/app" onClick={()=>setOpen(false)}>Member space</a><a className="mobile-nav-only mobile-nav-cta" href="/early-access" onClick={()=>setOpen(false)}>Join early access ↗</a></nav><div className="header-actions"><a href="/app" className="nav-enter">Member space</a><a className="nav-join" href="/early-access">Get early access <Chevron/></a><button className="nav-toggle" type="button" aria-label={open?"Close menu":"Open menu"} aria-expanded={open} aria-controls="emorva-navigation" onClick={()=>setOpen(v=>!v)}><span/><span/></button></div></div></header>}
function Footer(){return <footer className="editorial-footer"><div className="shell"><div className="footer-main"><div><Brand light/><p>An intentional space for friendship, attraction and the connections that matter.</p></div><div className="footer-columns"><div><span>Explore</span><a href="/discover">Connections</a><a href="/how-it-works">How it works</a><a href="/creators">Creators</a></div><div><span>Emorva</span><a href="/about">Our story</a><a href="/safety">Trust & safety</a><a href="/early-access">Early access</a></div><div><span>Information</span><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/app">Member space</a></div></div></div><div className="footer-fine"><span>© {new Date().getFullYear()} Emorva. Where chemistry begins.</span><span>Designed for adults 18+. In development.</span></div></div></footer>}
function Join({dark=false}:{dark?:boolean}){const [email,setEmail]=useState(""),[consent,setConsent]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState("");async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(!consent||busy)return;setBusy(true);setMessage("");try{const r=await fetch("/api/early-access",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:email.trim(),consent})});const x=await r.json() as {error?:string};if(!r.ok)throw new Error(x.error||"Unable to save your request");setMessage("You’re on the list. We’ll be in touch when Emorva opens.");setEmail("");setConsent(false)}catch(e){setMessage(e instanceof Error?e.message:"Something went wrong.")}finally{setBusy(false)}}return <div id="join" className={"join-panel"+(dark?" join-dark":"")}><div><p className="micro-label">GOOD THINGS BEGIN SOMEWHERE</p><h2>Be there from <em>the beginning.</em></h2><p>Get a thoughtful note when Emorva is ready to welcome its first members.</p></div><form onSubmit={submit}><div className="join-controls"><label className="visually-hidden" htmlFor="email">Email address</label><input id="email" type="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email address"/><button disabled={busy||!consent}>{busy?"Sending…":"Join early access"} <Chevron/></button></div><label className="join-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} required/> I’m 18 or older and agree to receive Emorva launch updates.</label><p role="status" className="join-status">{message}</p></form></div>}
function Photo({kind,className="",alt}:{kind:"hero"|"story"|"moment"|"portrait"|"closing";className?:string;alt:string}){return <div className={`visual-photo photo-${kind} ${className}`} role="img" aria-label={alt}/>}

function Home(){
 const pathways=[
  {number:"01",title:"Find your people",description:"Discover friendship, dating and the connections that feel right.",href:"/discover",name:"Discover connections"},
  {number:"02",title:"How it works",description:"Understand private introductions, mutual choice and the journey.",href:"/how-it-works",name:"See how matching works"},
  {number:"03",title:"For creators",description:"A future space for sharing, expression and community.",href:"/creators",name:"Explore the creator space"},
  {number:"04",title:"Your safety",description:"Learn about privacy, boundaries and thoughtful introductions.",href:"/safety",name:"Read about trust and safety"}
 ];
 return <><section className="home-hero"><Photo kind="hero" className="hero-image" alt="A stylish adult Black couple sharing an affectionate evening together"/><div className="hero-vignette"/><div className="shell hero-content"><div className="hero-text"><div className="hero-overline">A MORE MEANINGFUL WAY TO MEET</div><h1>Where <em>chemistry</em> begins.</h1><p>Something spontaneous. Something lasting. Or simply someone who gets you. Explore a more personal way to make a connection.</p><div className="hero-cta"><a className="button button-rose" href="/early-access">Join early access <Chevron/></a><a className="underlined-link" href="/discover">Explore connections <Chevron/></a></div><div className="hero-small-note">For adults 18+ <span/> Private by design <span/> Mutual by choice</div></div></div><div className="hero-side-label">EMORVA · AN INTENTIONAL CONNECTION SPACE</div></section>
 <section className="home-actions shell" aria-labelledby="home-actions-heading">
  <div className="home-actions-heading">
   <div><p className="micro-label">CHOOSE YOUR OWN BEGINNING</p><h2 id="home-actions-heading">The next step is <em>yours.</em></h2></div>
   <p>One simple place to begin. Go straight to what interests you—no endless scrolling.</p>
  </div>
  <nav className="home-category-links" aria-label="All connection categories">
   {GROUPS.map(g=><a key={g.id} href={`/discover?group=${g.id}`} className="home-category-link"><span>{g.label}</span><span aria-hidden>↗</span></a>)}
  </nav>
  <div className="home-actions-grid">
   {pathways.map(p=><a className="home-action-card" href={p.href} key={p.href} aria-label={p.name}>
    <span className="home-action-number">{p.number}</span>
    <div><h3>{p.title}</h3><p>{p.description}</p></div>
    <span className="home-action-arrow" aria-hidden>↗</span>
   </a>)}
  </div>
  <div className="home-bottom-line"><span>For adults 18+. Built around privacy and mutual choice.</span><a href="/early-access">Get early access <Chevron/></a></div>
 </section></>;
}
const groupIcons:Record<GroupId,string>={social:"01",dating:"02",adult:"03",activities:"04",creators:"05"};
function Discover(){
 const from=new URLSearchParams(window.location.search).get("group");
 const valid=GROUPS.some(x=>x.id===from);
 const [group,setGroup]=useState<GroupId>(valid?from as GroupId:"dating");
 const [selected,setSelected]=useState<string|null>(null);
 useEffect(()=>{
   const syncGroup=()=>{
     const value=new URLSearchParams(window.location.search).get("group");
     setGroup(GROUPS.some(g=>g.id===value)?value as GroupId:"dating");
     setSelected(null);
   };
   window.addEventListener("popstate",syncGroup);
   return ()=>window.removeEventListener("popstate",syncGroup);
 },[]);
 const active=GROUPS.find(x=>x.id===group)!;
 const items=INTENTS.filter(i=>i.group===group);
 const intent=INTENTS.find(i=>i.id===selected);
 function selectGroup(id:GroupId){
   setGroup(id);
   setSelected(null);
   window.history.pushState({group:id},"",`/discover?group=${id}`);
 }
 return <>
  <PageIntro eyebrow="FIND YOUR KIND OF CHEMISTRY" title={<>Every connection has <em>its own story.</em></>} desc="Explore all five connection categories below. Choose the kind of introduction that feels right for you."/>
  <section className="shell discover-layout">
   <aside className="catalog-aside">
    <p className="micro-label">ALL 5 CATEGORIES</p>
    <nav className="group-selector" aria-label="Connection categories">
     {GROUPS.map(g=><a key={g.id} href={`/discover?group=${g.id}`} aria-current={group===g.id?"page":undefined} className={group===g.id?"active":""} onClick={e=>{e.preventDefault();selectGroup(g.id)}}>
       <span className="group-number">{groupIcons[g.id]}</span>
       <span className="group-label">{g.label}</span>
       <span className="group-count">{INTENTS.filter(i=>i.group===g.id).length} options</span>
     </a>)}
    </nav>
    <p className="catalog-aside-note">All five categories are shown above. Fees are proposed and checkout is not live.</p>
   </aside>
   <div className="catalog-main" id="category-options">
    <div className="catalog-heading">
     <p className="micro-label">EXPLORE / {active.label.toUpperCase()}</p>
     <h2>{active.label}</h2>
     <p>{items.length} ways to connect. Choose an option to read more before joining early access.</p>
    </div>
    <div className="intent-list">
     {items.map(i=><button key={i.id} className={selected===i.id?"intent-row selected":"intent-row"} onClick={()=>setSelected(selected===i.id?null:i.id)} aria-expanded={selected===i.id}>
      <span className="intent-title"><b>{i.label}</b><small>{i.description}</small></span>
      <span className="intent-price">{price(i.feeNgn)} <span aria-hidden>↗</span></span>
     </button>)}
    </div>
    {intent&&<div className="intent-explainer">
     <button aria-label="Close service details" onClick={()=>setSelected(null)}>×</button>
     <p className="micro-label">YOUR SELECTED INTENTION</p>
     <h3>{intent.label}</h3>
     <p>{intent.description} Emorva's introduction service requires mutual interest and approval before private contacts are exchanged. It does not guarantee a date, meeting, or intimacy.</p>
     <div><strong>{price(intent.feeNgn)}</strong><span>Proposed introduction fee</span></div>
     <a className="button button-rose" href="/early-access">Get launch updates <Chevron/></a>
    </div>}
   </div>
  </section>
  <section className="shell section-end-note"><p><strong>Good to know.</strong> You can change preferences and explore different intentions. Each member chooses which introductions and approved contact methods they allow. Payment doesn't purchase anyone's consent.</p></section>
  <EarlyAccessNudge/>
 </>;
}

function EarlyAccess(){
 return <>
  <section className="early-intro"><div className="shell early-intro-layout">
   <div className="early-intro-copy">
    <p className="micro-label">YOUR INVITATION STARTS HERE</p>
    <h1>Be there when <em>chemistry begins.</em></h1>
    <p>Something meaningful is taking shape. Join the Emorva early-access list and be among the first to hear when we open our doors.</p>
    <a className="text-arrow early-intro-link" href="#join">Join the invitation <Chevron/></a>
    <span className="early-intro-note">For adults 18+ · No matchmaking or payments yet</span>
   </div>
   <Photo kind="portrait" className="early-intro-photo" alt="A smiling adult African woman in a warm velvet-toned interior"/>
  </div></section>
  <section className="shell early-form-wrap" aria-label="Early access registration">
   <Join dark/>
   <p className="early-privacy-line">We only ask for your email and consent to receive launch updates. <a href="/privacy">Read our privacy principles</a>.</p>
  </section>
 </>;
}
function EarlyAccessNudge(){return <div className="shell join-spacing"><div className="early-route-nudge">
 <div><p className="micro-label">BE HERE FROM THE BEGINNING</p><h2>Something good is <em>coming.</em></h2><p>Hear first when Emorva opens.</p></div>
 <a className="button button-rose" href="/early-access">Join early access <Chevron/></a>
 </div></div>}
function NotFound(){return <section className="shell not-found"><p className="micro-label">THIS PATH ISN'T HERE</p><h1>Let's find a <em>better connection.</em></h1><p>The page you're looking for isn't available.</p><div><a className="button button-rose" href="/">Back to Emorva <Chevron/></a><a className="text-arrow" href="/discover">Explore connections <Chevron/></a></div></section>}
function PageIntro({eyebrow,title,desc}:{eyebrow:string;title:React.ReactNode;desc:string}){return <section className="interior-intro"><div className="shell"><p className="micro-label">{eyebrow}</p><h1>{title}</h1><p>{desc}</p></div></section>}
function How(){return <><PageIntro eyebrow="INTRODUCTIONS, MADE HUMAN" title={<>A little curiosity.<br/><em>A genuine mutual yes.</em></>} desc="Emorva is designing a calmer way to find people who share your intentions, without relying on a group administrator."/><div className="shell editorial-split"><Photo kind="story" alt="An adult African couple sharing a warm, affectionate moment in a candlelit lounge"/><div><p className="micro-label">HOW WE CONNECT</p><h2>Thoughtful from <em>the very first hello.</em></h2><div className="how-steps">{[{n:"01",t:"Create a private profile",d:"Set your age, city, boundaries, intentions and which photos others may see. Adult-age assurance is required for matching; enhanced identity verification is an additional trust option."},{n:"02",t:"Find your kind of person",d:"Choose a category or talk to the Telegram assistant in your own words. Eligible search requests use monthly free search credits."},{n:"03",t:"See if the feeling is mutual",d:"The other member receives a private request and chooses whether to accept. No unwanted sharing or surprise introductions."},{n:"04",t:"Confirm your introduction",d:"An approved paid introduction occurs only after both people agree, payment is verified and both approve the contacts to share. This feature is not yet live."}].map(x=><div key={x.n}><span>{x.n}</span><div><h3>{x.t}</h3><p>{x.d}</p></div></div>)}</div></div></div><section className="soft-panel"><div className="shell soft-panel-inner"><h2>Available when <em>you are.</em></h2><p>Our planned 24-hour availability feature reserves credits while you're open to introductions. If no qualifying mutual introduction completes, those reserved credits are released automatically.</p><a className="text-arrow" href="/discover">Explore connection types <Chevron/></a></div></section><EarlyAccessNudge/></>}
function Safety(){return <><PageIntro eyebrow="PRIVACY IS A KIND OF ROMANCE" title={<>Feeling comfortable<br/><em>changes everything.</em></>} desc="An introduction should never cost you your boundaries. We design with consent and control at the centre."/><section className="shell safety-grid"><div><h2>Just enough to be seen.<br/><em>Never more than you choose.</em></h2><p>Emorva is being built around age assurance, visible identity-verification status and selective sharing. Stronger identity checks are optional where permitted, but proof of adulthood is not.</p><a href="/privacy" className="text-arrow">Privacy principles <Chevron/></a></div><Photo kind="portrait" alt="A relaxed adult African woman in a warm, private setting"/></section><section className="shell safety-principles">{[{n:"01",h:"Mutual approval",p:"Both people consent before private contact details are released."},{n:"02",h:"Age assured",p:"Matching requires adult-age assurance, not simply an age typed into a profile."},{n:"03",h:"Privacy controls",p:"Choose your visibility, approve your media, and withdraw permission before sharing."},{n:"04",h:"Respect comes first",p:"Block, report and leave without owing anyone a conversation or meeting."}].map(x=><div key={x.n}><span>{x.n}</span><h3>{x.h}</h3><p>{x.p}</p></div>)}</section><p className="shell safety-warning">Emorva is in development. No identity-verification badge guarantees another member's behaviour or safety. Never send money directly to someone promising intimacy or a meeting.</p><EarlyAccessNudge/></>}
function Creators(){return <><section className="creator-hero"><Photo kind="moment" alt="A Black adult creator in a beautifully lit intimate lounge"/><div className="creator-shade"/><div className="shell creator-head"><p className="micro-label">FOR PEOPLE WITH SOMETHING TO SHARE</p><h1>Be seen for <em>who you are.</em></h1><p>A future space for the stories, perspectives and communities that bring people together.</p><a href="/early-access" className="button button-rose">Hear when creators can join <Chevron/></a></div></section><section className="shell creator-intro"><div><p className="micro-label">BEYOND MATCHMAKING</p><h2>Expression deserves <em>its own space.</em></h2></div><div><p>Our future creator experience will support eligible content, communities and creator earnings—separate from dating, contact exchange and romantic consent.</p><p>The creator platform, paid media, Stars features and payouts are not live yet. We'll share specifics after safety and payment-provider reviews.</p></div></section><section className="creator-feature shell"><Photo kind="portrait" alt="Adult African woman relaxing and smiling, photographed in warm burgundy tones"/><div><h2>Feel free to <em>be interesting.</em></h2><p>Share your approved moments. Build a community around your interests. Discover new voices without pressure to date.</p><a href="/early-access" className="text-arrow">Join early access <Chevron/></a></div></section><EarlyAccessNudge/></>}
function About(){return <><PageIntro eyebrow="A DIFFERENT KIND OF INTRODUCTION" title={<>Because connection<br/><em>should feel natural.</em></>} desc="Emorva began with a simple question: what if meeting the right kind of person could feel more thoughtful, private and human?"/><section className="shell about-hero"><Photo kind="story" alt="Two adult Black people sharing an affectionate, relaxed moment"/><div><p className="micro-label">WHY EMORVA EXISTS</p><h2>Less noise.<br/><em>More intention.</em></h2><p>Most dating spaces make you scroll endlessly. Traditional introduction channels can leave you waiting for someone else to do the matching. We want to build a place where adults are clear about what they want, and each introduction is a choice made by two people.</p><p>From friendship to a long-term partner, everyone deserves to be met with care and respect.</p></div></section><section className="shell about-values"><p className="micro-label">WHAT MATTERS TO US</p><h2>Privacy, clarity, <em>chemistry.</em></h2><p>We value honest intentions, real boundaries and a service that earns trust through its behaviour—not through exaggerated promises.</p></section><EarlyAccessNudge/></>}
function Legal({privacy=false}:{privacy?:boolean}){return <><PageIntro eyebrow="THE IMPORTANT DETAILS" title={privacy?<>Your privacy, <em>your choice.</em></>:<>Clear expectations, <em>better connections.</em></>} desc={privacy?"A simple overview of the protections that shape Emorva while the full policy is prepared.":"A clear description of what Emorva is building and what members should expect."}/><article className="shell legal-copy">{privacy?<><h2>Information and choice</h2><p>Emorva is in development. When accounts open, age-assurance status, account settings, selected connection intentions and optional contact methods will be processed to support mutually agreed introductions. Until formal terms are published and accepted, no live paid introductions or contact releases are enabled.</p><h2>Media and verification</h2><p>Private verification evidence must remain with an approved verification provider wherever practical. Profile media shared for discovery will require explicit approval and moderation. Members will have controls for visibility, blocking and deletion.</p><h2>Financial and contact data</h2><p>Payment outcomes must be verified server-side. Contact details must not be shown without both members' current permission. We will publish a full privacy notice before production onboarding.</p></>:<><h2>Adults only</h2><p>Emorva is intended only for adults aged 18 and over. Age assurance is mandatory for access to matching. Self-declared age is not enough.</p><h2>No guaranteed encounters</h2><p>Proposed introduction fees are for a disclosed optional matchmaking service, not a promise of dating, intimacy, or a meeting. No member may buy another person's consent.</p><h2>Current release</h2><p>Site content is an early-access preview. Commercial matchmaking, creator subscriptions and contact sharing are not enabled. Formal terms and legal/payment approvals are required before those services open.</p></>}</article><EarlyAccessNudge/></>}
export default function Site(){
 const path=window.location.pathname.replace(/\/$/,"")||"/";
 const route=(Object.entries(paths).find(([,v])=>v===path)?.[0]||"notFound") as Route|"notFound";
 useEffect(()=>{
  if(path==="/" && window.location.hash==="#join"){window.location.replace("/early-access");return;}
  const titles:Record<Route|"notFound",string>={
   home:"Emorva — Where chemistry begins",
   discover:"Discover Connections | Emorva",
   how:"How It Works | Emorva",
   safety:"Trust & Safety | Emorva",
   creators:"For Creators | Emorva",
   about:"Our Story | Emorva",
   privacy:"Privacy | Emorva",
   terms:"Terms | Emorva",
   early:"Join Early Access | Emorva",
   notFound:"Page Not Found | Emorva"
  };
  document.title=titles[route];
 },[route,path]);
 return <div className="emorva-site">
  <a className="skip-to" href="#main">Skip to content</a>
  <Header route={route}/>
  <main id="main">
   {route==="home"?<Home/>:
    route==="discover"?<Discover/>:
    route==="how"?<How/>:
    route==="safety"?<Safety/>:
    route==="creators"?<Creators/>:
    route==="about"?<About/>:
    route==="early"?<EarlyAccess/>:
    route==="privacy"||route==="terms"?<Legal privacy={route==="privacy"}/>:
    <NotFound/>}
  </main>
  <Footer/>
 </div>;
}
