import {describe,it,expect} from "vitest";
import {referenceReviewSchema,canGenerateWithReference,nextReferenceStatus} from "./reference-sheet-approval";
describe("reference sheet approval",()=>{
 it("blocks unapproved references",()=>{for(const status of ["draft","pending_review","changes_requested"] as const)expect(canGenerateWithReference(status)).toBe(false);expect(canGenerateWithReference("approved")).toBe(true)});
 it("requires change notes",()=>expect(referenceReviewSchema.safeParse({decision:"request_changes",sheetId:"00000000-0000-4000-8000-000000000001",notes:""}).success).toBe(false));
 it("accepts explicit approval",()=>expect(nextReferenceStatus("pending_review",{decision:"approve",sheetId:"00000000-0000-4000-8000-000000000001"})).toBe("approved"));
 it("rejects re-reviewing approved sheets",()=>expect(()=>nextReferenceStatus("approved",{decision:"approve",sheetId:"00000000-0000-4000-8000-000000000001"})).toThrow());
});
