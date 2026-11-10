export type GroupId="social"|"dating"|"adult"|"activities"|"creators";
export interface ConnectionIntent {id:string;label:string;description:string;group:GroupId;feeNgn:number;icon:string;}
export interface ConnectionGroup {id:GroupId;label:string;}
export const GROUPS:ReadonlyArray<ConnectionGroup>=[
  {id:"social",label:"Friendship & social"},
  {id:"dating",label:"Dating & romance"},
  {id:"adult",label:"Adult connections"},
  {id:"activities",label:"Activities & fitness"},
  {id:"creators",label:"Creators"}
];
export const INTENTS:ReadonlyArray<ConnectionIntent>=[
 {id:"friends",group:"social",label:"Platonic friendship",feeNgn:2000,description:"Meet someone for laughter, genuine conversations and companionship.",icon:"♡"},
 {id:"activity",group:"social",label:"Activity or social buddy",feeNgn:2000,description:"Find a friend who enjoys similar outings and experiences.",icon:"✦"},
 {id:"study",group:"social",label:"Study & accountability",feeNgn:2000,description:"Motivation, focus and accountability with shared goals.",icon:"✧"},
 {id:"gaming",group:"social",label:"Gaming buddy",feeNgn:2000,description:"Discover someone who shares your favorite games.",icon:"♧"},
 {id:"casual",group:"dating",label:"Casual dating",feeNgn:2000,description:"A relaxed romantic connection, at your own pace.",icon:"♡"},
 {id:"serious",group:"dating",label:"Serious relationship",feeNgn:4000,description:"Meet adults open to something meaningful and lasting.",icon:"❦"},
 {id:"private",group:"dating",label:"Private dating",feeNgn:7500,description:"Discreet discovery with enhanced visibility controls.",icon:"✧"},
 {id:"marriage",group:"dating",label:"Marriage-minded",feeNgn:15000,description:"Discover someone seeking lasting commitment.",icon:"◈"},
 {id:"fwb",group:"adult",label:"Friends with benefits",feeNgn:5000,description:"An opt-in, consensual adult connection with shared intentions.",icon:"✦"},
 {id:"noncommercial",group:"adult",label:"Non-commercial casual connection",feeNgn:8000,description:"Private introductions between adults; not paid sexual services.",icon:"♡"},
 {id:"jog",group:"activities",label:"Running or jogging buddy",feeNgn:2000,description:"Find someone who enjoys running alongside you.",icon:"↗"},
 {id:"gym",group:"activities",label:"Workout buddy",feeNgn:2000,description:"Share workout goals, encouragement and fitness routines.",icon:"✧"},
 {id:"travel",group:"activities",label:"Adventure companion",feeNgn:3000,description:"Discover people with similar travel and activity interests.",icon:"✦"},
 {id:"event",group:"activities",label:"Event companion",feeNgn:3000,description:"Meet someone who enjoys the same public events.",icon:"♧"},
 {id:"creator",group:"creators",label:"Creator collaboration",feeNgn:5000,description:"Connect with opted-in creators for eligible collaborations.",icon:"✧"}
];
export const FREE_MONTHLY_SEARCH_CREDITS=100;
export const AVAILABILITY_RESERVE_RATE=.75;
export const AVAILABILITY_DURATION_HOURS=24;
export function getIntent(id:string){return INTENTS.find(i=>i.id===id);}
export function availabilityPrice(feeNgn:number){return Math.round(feeNgn*AVAILABILITY_RESERVE_RATE);}
