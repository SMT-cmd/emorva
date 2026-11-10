import {CATALOG,SEARCH_CREDIT_GRANT,AVAILABILITY_FRACTION,AVAILABILITY_HOURS} from "../_lib/catalog.js";
export async function onRequestGet(){
 return new Response(JSON.stringify({status:"planning",paymentEnabled:false,identityVerificationEnabled:false,searchCreditGrant:SEARCH_CREDIT_GRANT,availabilityRate:AVAILABILITY_FRACTION,availabilityHours:AVAILABILITY_HOURS,priceCurrency:"NGN",intents:CATALOG}),{
 headers:{"content-type":"application/json; charset=utf-8","cache-control":"public, max-age=180"}
 });
}
