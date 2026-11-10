const categories = [
 {id:"friendship",label:"Friendship",symbol:"♡",items:[
  {name:"Platonic friendship",price:2000,description:"Meet someone to share conversations, laughter and life with."},
  {name:"Social or activity buddy",price:2000,description:"Discover someone to explore the city or try activities with."},
  {name:"Study & accountability buddy",price:2000,description:"Find motivation and encouragement from a compatible peer."},
  {name:"Gaming buddy",price:2000,description:"Connect over games and shared hobbies."}
 ]},
 {id:"romance",label:"Dating & romance",symbol:"✿",items:[
  {name:"Casual dating",price:2000,description:"Explore a relaxed romantic connection at your own pace."},
  {name:"Serious relationship",price:4000,description:"Meet people seeking meaningful long-term companionship."},
  {name:"Private dating",price:7500,description:"More discreet discovery with enhanced visibility controls."},
  {name:"Marriage-minded",price:15000,description:"Meet someone with a mutual interest in lasting commitment."}
 ]},
 {id:"adult",label:"Adult connections",symbol:"✦",items:[
  {name:"Friends with benefits",price:5000,description:"Meet consenting adults who express compatible intentions."},
  {name:"Non-commercial casual connection",price:8000,description:"Private introductions between adults seeking something casual. No paid sexual services."}
 ]},
 {id:"activities",label:"Activities & fitness",symbol:"↗",items:[
  {name:"Jogging or running partner",price:2000,description:"Discover someone who shares your running routine."},
  {name:"Gym or workout buddy",price:2000,description:"Train with someone who shares your energy."},
  {name:"Travel or adventure buddy",price:3000,description:"Connect with an adult who loves exploring new places."},
  {name:"Event companion",price:3000,description:"Find someone who enjoys similar public events."}
 ]},
 {id:"creators",label:"Creators",symbol:"✧",items:[
  {name:"Creator collaboration",price:5000,description:"Find an opted-in creator open to a legitimate collaboration."}
 ]}
];
const byId = (id)=>document.getElementById(id);
const nf = new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0});
let current = categories[1].id;
function renderCategories(){
 const tabs=byId("category-tabs"), panel=byId("category-panel");
 tabs.replaceChildren();
 for(const category of categories){
  const tab=document.createElement("button");tab.type="button";tab.className="tab";tab.role="tab";tab.id="tab-"+category.id;tab.textContent=category.label;
  tab.setAttribute("aria-selected",String(current===category.id));tab.setAttribute("aria-controls","category-panel");
  tab.addEventListener("click",()=>{current=category.id;renderCategories();tab.focus();});
  tabs.append(tab);
 }
 const active=categories.find(c=>c.id===current);
 panel.setAttribute("role","tabpanel");panel.setAttribute("aria-labelledby","tab-"+current);
 panel.replaceChildren();
 for(const intent of active.items){
  const card=document.createElement("button");card.type="button";card.className="intent-card";
  const icon=document.createElement("span");icon.className="intent-icon";icon.setAttribute("aria-hidden","true");icon.textContent=active.symbol;
  const title=document.createElement("h3");title.textContent=intent.name;
  const desc=document.createElement("p");desc.textContent=intent.description;
  const bottom=document.createElement("div");bottom.className="intent-card-bottom";
  const fee=document.createElement("span");fee.className="intent-price";fee.textContent=nf.format(intent.price);
  const arrow=document.createElement("span");arrow.className="intent-arrow";arrow.setAttribute("aria-hidden","true");arrow.textContent="↗";
  bottom.append(fee,arrow);card.append(icon,title,desc,bottom);
  card.addEventListener("click",()=>openIntent(intent));
  panel.append(card);
 }
}
function openIntent(intent){
 byId("dialog-title").textContent=intent.name;
 byId("dialog-copy").textContent=intent.description;
 byId("dialog-price").textContent=nf.format(intent.price);
 byId("intent-dialog").showModal();
}
byId("dialog-close").addEventListener("click",()=>byId("intent-dialog").close());
byId("dialog-action").addEventListener("click",()=>byId("intent-dialog").close());
byId("intent-dialog").addEventListener("click",event=>{if(event.target===byId("intent-dialog"))byId("intent-dialog").close();});
byId("menu-toggle").addEventListener("click",()=>{
 const menu=byId("nav-links");const open=menu.classList.toggle("open");
 byId("menu-toggle").setAttribute("aria-expanded",String(open));
 byId("menu-toggle").setAttribute("aria-label",open?"Close menu":"Open menu");
});
for(const link of byId("nav-links").querySelectorAll("a"))link.addEventListener("click",()=>{byId("nav-links").classList.remove("open");byId("menu-toggle").setAttribute("aria-expanded","false");});
byId("year").textContent=new Date().getFullYear();
const form=byId("notify-form"),note=byId("form-note");
form.addEventListener("submit",async (event)=>{
 event.preventDefault();
 const email=byId("notify-email").value.trim();
 if(!email||!byId("notify-email").checkValidity())return;
 const btn=form.querySelector("button");
 btn.disabled=true;btn.textContent="Submitting…";
 try{
  const response=await fetch("/api/early-access",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,consent:true})});
  const result=await response.json();
  if(!response.ok)throw new Error(result.error||"Could not save your request.");
  form.reset();note.textContent="Thanks! You're on the early-access list.";
 }catch(error){note.textContent=error.message||"Please try again later.";}finally{btn.disabled=false;btn.textContent="Join early access ↗";}
});
renderCategories();
