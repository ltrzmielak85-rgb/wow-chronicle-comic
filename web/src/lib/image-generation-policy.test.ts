import {describe,it,expect} from "vitest";
import {IMAGE_GENERATION_POLICY,quoteImageGenerationCredits,generationQualityForPlan} from "./image-generation-policy";
describe("launch image generation quality",()=>{
 it("charges exactly one credit per page",()=>{expect(quoteImageGenerationCredits(1)).toBe(1);expect(quoteImageGenerationCredits(20)).toBe(20)});
 it("uses identical quality across plans",()=>{for(const plan of ["free","adventurer","hero","legend"])expect(generationQualityForPlan(plan)).toBe("high")});
 it("disables premium and adaptive pricing",()=>{expect(IMAGE_GENERATION_POLICY.premiumUpsellEnabled).toBe(false);expect(IMAGE_GENERATION_POLICY.adaptiveQualityEnabled).toBe(false)});
 it("rejects invalid page counts",()=>expect(()=>quoteImageGenerationCredits(21)).toThrow());
});
