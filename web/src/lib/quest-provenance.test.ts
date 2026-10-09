import {describe,it,expect} from "vitest";
import {questProvenanceSchema,questProvenanceDisclosure,historicalStoryInstructions} from "./quest-provenance";
describe("quest provenance",()=>{
 it("accepts only supported provenance",()=>{expect(questProvenanceSchema.safeParse("recorded").success).toBe(true);expect(questProvenanceSchema.safeParse("invented").success).toBe(false);});
 it("labels historical comics as reconstructed",()=>expect(questProvenanceDisclosure("historical_reconstructed")).toContain("Reconstructed"));
 it("forbids unrecorded facts in reconstructions",()=>expect(historicalStoryInstructions("historical_reconstructed")).toContain("Do not assert unrecorded"));
});
