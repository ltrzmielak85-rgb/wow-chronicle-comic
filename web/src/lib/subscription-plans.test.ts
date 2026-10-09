import {describe,it,expect} from "vitest";
import {SUBSCRIPTION_PLANS,monthlyAllowance,quotedSubscriptionPrice} from "./subscription-plans";
describe("subscription plans",()=>{
 it("uses agreed monthly allowances",()=>{expect(monthlyAllowance("adventurer")).toBe(20);expect(monthlyAllowance("hero")).toBe(50);expect(monthlyAllowance("legend")).toBe(100);});
 it("retains proposed USD prices",()=>{expect(quotedSubscriptionPrice("adventurer")).toBe("$7.99/month");expect(quotedSubscriptionPrice("hero")).toBe("$14.99/month");expect(quotedSubscriptionPrice("legend")).toBe("$24.99/month");});
 it("keeps one lifetime free credit",()=>expect(SUBSCRIPTION_PLANS.free.lifetimeFreeCredits).toBe(1));
});
