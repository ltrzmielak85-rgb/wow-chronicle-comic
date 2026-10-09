export type CreditSource="monthly"|"purchased";
export type CreditAllocation={monthly:number;purchased:number;total:number};
/** Spend monthly credits first, preserving non-expiring purchased credits. */
export function planCreditAllocation(pages:number,monthlyAvailable:number,purchasedAvailable:number):CreditAllocation{
 for(const n of [pages,monthlyAvailable,purchasedAvailable]){
  if(!Number.isSafeInteger(n)||n<0)throw new Error("Invalid credit quantity");
 }
 if(pages<1||pages>20)throw new Error("Comic must use 1–20 pages");
 if(monthlyAvailable+purchasedAvailable<pages)throw new Error("Insufficient credits");
 const monthly=Math.min(pages,monthlyAvailable);
 return {monthly,purchased:pages-monthly,total:pages};
}
