import {describe,it,expect} from "vitest";
import {planCreditAllocation} from "./credit-packs";
describe("purchased credit packs",()=>{
 it("spends expiring monthly credits first",()=>expect(planCreditAllocation(12,8,10)).toEqual({monthly:8,purchased:4,total:12}));
 it("preserves purchased credits when monthly covers cost",()=>expect(planCreditAllocation(5,20,10).purchased).toBe(0));
 it("supports purchased-only payment",()=>expect(planCreditAllocation(10,0,15)).toEqual({monthly:0,purchased:10,total:10}));
 it("rejects overspending",()=>expect(()=>planCreditAllocation(20,5,10)).toThrow("Insufficient"));
});
