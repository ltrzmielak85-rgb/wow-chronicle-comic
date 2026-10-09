import {describe,it,expect} from "vitest";
import {remainingMonthlyCredits,canReserveCredits} from "./monthly-credits";
const cycle={start:"2026-10-01T00:00:00Z",end:"2026-11-01T00:00:00Z",allowance:40,reserved:5,consumed:15};
describe("monthly credit allowance",()=>{
 it("counts reserved and consumed credits against available balance",()=>expect(remainingMonthlyCredits(cycle)).toBe(20));
 it("supports a 20-page chapter when sufficient credits remain",()=>expect(canReserveCredits(cycle,20,new Date("2026-10-10T00:00:00Z"))).toBe(true));
 it("rejects overspending and expired cycles",()=>{expect(canReserveCredits(cycle,21,new Date("2026-10-10T00:00:00Z"))).toBe(false);expect(canReserveCredits(cycle,5,new Date("2026-11-01T00:00:00Z"))).toBe(false);});
});
