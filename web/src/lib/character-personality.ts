import {z} from "zod";
export const PERSONALITY_TRAITS=["brave","cautious","honorable","sarcastic","compassionate","mysterious","ruthless","curious","stoic","playful","loyal","ambitious"] as const;
export const personalityProfileSchema=z.object({
 traits:z.array(z.enum(PERSONALITY_TRAITS)).min(1).max(3).refine(v=>new Set(v).size===v.length,"Choose distinct traits"),
 speakingStyle:z.enum(["balanced","formal","casual","terse"]).default("balanced")
});
export type PersonalityProfile=z.infer<typeof personalityProfileSchema>;
export function personalityStoryDirection(profile:PersonalityProfile):string{
 const parsed=personalityProfileSchema.parse(profile);
 return [
  `Maintain these stable character personality traits across adventures: ${parsed.traits.join(", ")}.`,
  `Dialogue speaking style: ${parsed.speakingStyle}.`,
  "Express traits through reactions, choices of words, and tone, not fabricated quest outcomes.",
  "Personality does not override recorded events, quest facts, or historical character identity.",
  "Avoid presenting personality traits as facts observed by the addon."
 ].join("\n");
}
