// Single server-side source of truth for future paid introduction catalogue.
// All amounts are proposed NGN prices and are NOT active checkout products.
export const CATALOG = Object.freeze([
 {id:"friends",group:"Friendship & Social",label:"Platonic friendship",ngn:2000},
 {id:"activity",group:"Friendship & Social",label:"Social / activity buddy",ngn:2000},
 {id:"jog",group:"Activities & Fitness",label:"Jogging / running buddy",ngn:2000},
 {id:"gym",group:"Activities & Fitness",label:"Gym / workout buddy",ngn:2000},
 {id:"study",group:"Friendship & Social",label:"Study / accountability buddy",ngn:2000},
 {id:"gaming",group:"Friendship & Social",label:"Gaming buddy",ngn:2000},
 {id:"casual",group:"Dating & Romance",label:"Casual dating",ngn:2000},
 {id:"fwb",group:"Adult Connections",label:"Friends with benefits",ngn:5000},
 {id:"noncommercial",group:"Adult Connections",label:"Non-commercial casual connection",ngn:8000},
 {id:"serious",group:"Dating & Romance",label:"Serious relationship",ngn:4000},
 {id:"private",group:"Dating & Romance",label:"Private dating",ngn:7500},
 {id:"marriage",group:"Dating & Romance",label:"Marriage-minded",ngn:15000},
 {id:"travel",group:"Activities & Fitness",label:"Travel / adventure buddy",ngn:3000},
 {id:"event",group:"Activities & Fitness",label:"Event companion",ngn:3000},
 {id:"creator",group:"Creators & Networking",label:"Creator collaboration",ngn:5000}
]);
export const SEARCH_CREDIT_GRANT = 100;
export const AVAILABILITY_FRACTION = 0.75;
export const AVAILABILITY_HOURS = 24;
export function getIntent(id){return CATALOG.find(x=>x.id===id)||null;}
export function availabilityPrice(id){
 const intent=getIntent(id);
 return intent?Math.round(intent.ngn*AVAILABILITY_FRACTION):null;
}
