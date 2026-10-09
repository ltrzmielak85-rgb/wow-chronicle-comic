export type CreditCycle={start:string;end:string;allowance:number;reserved:number;consumed:number};
export function remainingMonthlyCredits(cycle:CreditCycle):number{
 for(const value of [cycle.allowance,cycle.reserved,cycle.consumed])
  if(!Number.isSafeInteger(value)||value<0)throw new Error("Invalid credit amount");
 return Math.max(0,cycle.allowance-cycle.reserved-cycle.consumed);
}
export function canReserveCredits(cycle:CreditCycle,pages:number,now=new Date()):boolean{
 const start=Date.parse(cycle.start),end=Date.parse(cycle.end);
 if(!Number.isFinite(start)||!Number.isFinite(end)||start>=end||!Number.isSafeInteger(pages)||pages<1)return false;
 return now.getTime()>=start&&now.getTime()<end&&remainingMonthlyCredits(cycle)>=pages;
}
export const MONTHLY_CREDIT_POLICY={
 reset:"billing_cycle",
 rollover:false,
 creditsPerPage:1,
 questPages:{min:1,max:5},
 chapterPages:{min:5,max:20}
} as const;
