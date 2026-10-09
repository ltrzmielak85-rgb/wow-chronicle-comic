import {describe,it,expect} from "vitest";
import {dialogueLineSchema,dialogueGenerationInstructions} from "./comic-dialogue-policy";
describe("cinematic lore-faithful dialogue",()=>{
 it("requires evidence for recorded quotes",()=>expect(dialogueLineSchema.safeParse({speaker:"NPC",line:"Greetings",provenance:"recorded",sourceEventSeq:null}).success).toBe(false));
 it("permits explicitly original dialogue",()=>expect(dialogueLineSchema.safeParse({speaker:"Hero",line:"We should move.",provenance:"cinematic_original",sourceEventSeq:null}).success).toBe(true));
 it("prohibits false recorded accomplishments",()=>expect(dialogueGenerationInstructions()).toContain("Never invent quest completion"));
});
