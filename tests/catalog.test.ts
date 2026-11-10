import {test} from "node:test";
import assert from "node:assert/strict";
import {GROUPS,INTENTS,FREE_MONTHLY_SEARCH_CREDITS,AVAILABILITY_RESERVE_RATE,availabilityPrice,getIntent} from "../shared/catalog";
test("unique intent identifiers and integer naira fees",()=>{
 const ids=INTENTS.map(x=>x.id);
 assert.equal(ids.length,new Set(ids).size);
 assert.ok(INTENTS.every(x=>Number.isInteger(x.feeNgn)&&x.feeNgn>0));
});
test("approved price structure",()=>{
 assert.equal(getIntent("friends")?.feeNgn,2000);
 assert.equal(getIntent("casual")?.feeNgn,2000);
 assert.equal(getIntent("fwb")?.feeNgn,5000);
 assert.equal(getIntent("noncommercial")?.feeNgn,8000);
 assert.equal(getIntent("marriage")?.feeNgn,15000);
});
test("availability rate and free search allowance",()=>{
 assert.equal(AVAILABILITY_RESERVE_RATE,.75);
 assert.equal(availabilityPrice(5000),3750);
 assert.equal(FREE_MONTHLY_SEARCH_CREDITS,100);
});

test("all five connection groups remain available",()=>{
 const categories=["social","dating","adult","activities","creators"];
 assert.equal(GROUPS.length,5);
 assert.deepEqual(GROUPS.map(g=>g.id),categories);
 for(const g of GROUPS) assert.ok(INTENTS.some(i=>i.group===g.id),`No options for ${g.id}`);
 assert.equal(INTENTS.length,15);
});
