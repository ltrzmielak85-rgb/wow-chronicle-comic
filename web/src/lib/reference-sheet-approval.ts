import {z} from "zod";
export const referenceReviewSchema=z.discriminatedUnion("decision",[
 z.object({decision:z.literal("approve"),sheetId:z.string().uuid()}),
 z.object({decision:z.literal("request_changes"),sheetId:z.string().uuid(),notes:z.string().trim().min(1).max(1200)})
]);
export type ReferenceReview=z.infer<typeof referenceReviewSchema>;
export type ReferenceSheetStatus="draft"|"pending_review"|"changes_requested"|"approved";
export function canGenerateWithReference(status:ReferenceSheetStatus):boolean{
 return status==="approved";
}
export function nextReferenceStatus(current:ReferenceSheetStatus,review:ReferenceReview):ReferenceSheetStatus{
 if(current!=="pending_review")throw new Error("Only sheets pending review can be reviewed");
 return review.decision==="approve"?"approved":"changes_requested";
}
