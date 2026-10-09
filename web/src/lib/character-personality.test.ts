import {describe,it,expect} from "vitest";
import {personalityProfileSchema,personalityStoryDirection} from "./character-personality";
describe("player-selected personality",()=>{
 it("accepts up to three consistent traits",()=>expect(personalityProfileSchema.parse({traits:["brave","sarcastic"]}).speakingStyle).toBe("balanced"));
 it("rejects duplicates and more than three traits",()=>{
  expect(personalityProfileSchema.safeParse({traits:["brave","brave"]}).success).toBe(false);
  expect(personalityProfileSchema.safeParse({traits:["brave","loyal","curious","stoic"]}).success).toBe(false);
 });
 it("protects recorded events",()=>expect(personalityStoryDirection({traits:["honorable"],speakingStyle:"formal"})).toContain("does not override recorded events"));
});
