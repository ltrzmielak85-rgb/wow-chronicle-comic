export const SUBSCRIPTION_PLANS = {
 free: {name:"Free",priceUsdCents:0,monthlyCredits:0,lifetimeFreeCredits:1},
 adventurer: {name:"Adventurer",priceUsdCents:799,monthlyCredits:20,lifetimeFreeCredits:0},
 hero: {name:"Hero",priceUsdCents:1499,monthlyCredits:50,lifetimeFreeCredits:0},
 legend: {name:"Legend",priceUsdCents:2499,monthlyCredits:100,lifetimeFreeCredits:0}
} as const;
export type SubscriptionPlan=keyof typeof SUBSCRIPTION_PLANS;
export function monthlyAllowance(plan:SubscriptionPlan):number{
 return SUBSCRIPTION_PLANS[plan].monthlyCredits;
}
export function quotedSubscriptionPrice(plan:SubscriptionPlan):string{
 return `$${(SUBSCRIPTION_PLANS[plan].priceUsdCents/100).toFixed(2)}/month`;
}
