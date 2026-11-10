export async function onRequestGet(){
 return Response.json({ok:true,service:"emorva",environment:"development",paymentsEnabled:false,contactSharingEnabled:false,checkedAt:new Date().toISOString()},{headers:{"cache-control":"no-store"}});
}
