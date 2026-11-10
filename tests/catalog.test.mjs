import {test} from "node:test";
import assert from "node:assert/strict";
import {CATALOG,SEARCH_CREDIT_GRANT,AVAILABILITY_FRACTION,availabilityPrice,getIntent} from "../functions/_lib/catalog.js";
test("catalog contains unique stable IDs and non-negative integer NGN fees",()=>{
 const ids=CATALOG.map(item=>item.id);
 assert.equal(new Set(ids).size,ids.length);
 assert.ok(CATALOG.every(x=>Number.isInteger(x.ngn)&&x.ngn>=0));
});
test("key approved planning prices",()=>{
 assert.equal(getIntent("friends").ngn,2000);
 assert.equal(getIntent("casual").ngn,2000);
 assert.equal(getIntent("fwb").ngn,5000);
 assert.equal(getIntent("noncommercial").ngn,8000);
 assert.equal(getIntent("marriage").ngn,15000);
});
test("availability reservation uses 75% and search allowance stays free",()=>{
 assert.equal(availabilityPrice("fwb"),3750);
 assert.equal(availabilityPrice("marriage"),11250);
 assert.equal(AVAILABILITY_FRACTION,.75);
 assert.equal(SEARCH_CREDIT_GRANT,100);
});
test("unknown intent never acquires an implicit price",()=>{
 assert.equal(getIntent("unknown"),null);
 assert.equal(availabilityPrice("unknown"),null);
});
