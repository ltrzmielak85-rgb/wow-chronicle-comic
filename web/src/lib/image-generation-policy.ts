/** Launch policy: one consistent quality tier, regardless of subscription. */
export const IMAGE_GENERATION_POLICY = {
 qualityTier:"high",
 creditsPerPage:1,
 premiumUpsellEnabled:false,
 adaptiveQualityEnabled:false,
 maxAttemptsPerPage:3
} as const;
export type ImageGenerationPolicy=typeof IMAGE_GENERATION_POLICY;
export function quoteImageGenerationCredits(pages:number):number{
 if(!Number.isSafeInteger(pages)||pages<1||pages>20)throw new Error("Invalid page count");
 return pages*IMAGE_GENERATION_POLICY.creditsPerPage;
}
export function generationQualityForPlan(_plan:string):"high"{
 return IMAGE_GENERATION_POLICY.qualityTier;
}
