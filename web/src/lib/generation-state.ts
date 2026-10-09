export type GenerationStatus="pending"|"reserved"|"processing"|"completed"|"failed"|"cancelled";
export type AttemptOutcome="success"|"retryable_failure"|"terminal_failure";
export type Decision={nextStatus:GenerationStatus;retry:boolean;releaseCredits:boolean;publish:boolean};
export function decideGenerationOutcome(
 outcome:AttemptOutcome,attemptNumber:number,maxAttempts=3
):Decision{
 if(!Number.isInteger(attemptNumber)||attemptNumber<1||!Number.isInteger(maxAttempts)||maxAttempts<1)throw new Error("Invalid attempt count");
 if(outcome==="success")return {nextStatus:"completed",retry:false,releaseCredits:false,publish:true};
 if(outcome==="retryable_failure"&&attemptNumber<maxAttempts)return {nextStatus:"processing",retry:true,releaseCredits:false,publish:false};
 return {nextStatus:"failed",retry:false,releaseCredits:true,publish:false};
}
