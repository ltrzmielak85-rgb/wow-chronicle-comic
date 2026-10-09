import {describe,it,expect} from "vitest";
import {CREDIT_PACKS,creditPackQuote} from "./credit-pack-catalog";
describe("credit pack catalog",()=>{
 it("offers the agreed non-expiring packs",()=>expect(Object.values(CREDIT_PACKS).map(x=>[x.credits,x.priceUsdCents])).toEqual([[10,499],[25,999],[50,1799]]));
 it("formats USD prices",()=>expect(creditPackQuote("pack_25").displayPrice).toBe("$9.99"));
 it("provides increasing bulk value",()=>expect(creditPackQuote("pack_50").usdCentsPerCredit).toBeLessThan(creditPackQuote("pack_10").usdCentsPerCredit));
});
