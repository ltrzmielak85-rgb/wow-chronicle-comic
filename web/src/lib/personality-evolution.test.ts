import {describe,it,expect} from "vitest";
import {snapshotPersonality,personalityForGeneration} from "./personality-evolution";
describe("personality evolution",()=>{
 it("freezes personality when generation is requested",()=>{
  const current={traits:["brave"] as ["brave"],speakingStyle:"balanced" as const};
  const saved=snapshotPersonality(current,1);
  current.traits=["sarcastic" as "brave"];
  expect(personalityForGeneration(saved).traits).toEqual(["brave"]);
 });
 it("supports newer revisions for later requests",()=>expect(snapshotPersonality({traits:["curious"],speakingStyle:"casual"},2).revision).toBe(2));
 it("rejects invalid revisions",()=>expect(()=>snapshotPersonality({traits:["loyal"],speakingStyle:"balanced"},0)).toThrow());
});
