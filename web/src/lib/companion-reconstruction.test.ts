import {describe,it,expect} from "vitest";
import {companionReconstructionSchema,resolveCompanionForQuest} from "./companion-reconstruction";
const id="00000000-0000-4000-8000-000000000001";
describe("missing companion history",()=>{
 it("requires an explicit player choice when evidence is missing",()=>expect(()=>resolveCompanionForQuest({kind:"missing"})).toThrow());
 it("allows no companion with reconstruction disclosure",()=>{
  const result=resolveCompanionForQuest({kind:"missing"},{choice:"none"});
  expect(result.companionId).toBeNull();
  expect(result.provenance).toBe("player_reconstructed");
  expect(result.disclosure).toContain("reconstructed");
 });
 it("allows a player-selected companion",()=>expect(resolveCompanionForQuest({kind:"missing"},{choice:"companion",companionId:id}).companionId).toBe(id));
 it("preserves recorded facts over manual selections",()=>expect(resolveCompanionForQuest({kind:"recorded",companionId:null},{choice:"companion",companionId:id}).companionId).toBeNull());
 it("rejects missing companion identifiers",()=>expect(companionReconstructionSchema.safeParse({choice:"companion"}).success).toBe(false));
});
