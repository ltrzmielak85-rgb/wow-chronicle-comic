export const CREDIT_PACKS = {
 pack_10: {credits:10,priceUsdCents:499},
 pack_25: {credits:25,priceUsdCents:999},
 pack_50: {credits:50,priceUsdCents:1799}
} as const;
export type CreditPackId=keyof typeof CREDIT_PACKS;
export function creditPackQuote(id:CreditPackId){
 const pack=CREDIT_PACKS[id];
 return {...pack,displayPrice:`$${(pack.priceUsdCents/100).toFixed(2)}`,usdCentsPerCredit:pack.priceUsdCents/pack.credits};
}
