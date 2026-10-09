import {personalityProfileSchema,type PersonalityProfile} from "./character-personality";
import {z} from "zod";
export const personalitySnapshotSchema=personalityProfileSchema.extend({
 revision:z.number().int().positive()
});
export type PersonalitySnapshot=z.infer<typeof personalitySnapshotSchema>;
export function snapshotPersonality(profile:PersonalityProfile,revision:number):PersonalitySnapshot{
 return personalitySnapshotSchema.parse({...profile,revision});
}
/** Rendering must use the frozen request snapshot, never a later live profile. */
export function personalityForGeneration(snapshot:PersonalitySnapshot):PersonalityProfile{
 const parsed=personalitySnapshotSchema.parse(snapshot);
 return {traits:parsed.traits,speakingStyle:parsed.speakingStyle};
}
