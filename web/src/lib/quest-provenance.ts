import {z} from "zod";
export const questProvenanceSchema=z.enum(["recorded","historical_reconstructed"]);
export type QuestProvenance=z.infer<typeof questProvenanceSchema>;
export const QUEST_PROVENANCE_LABELS:Record<QuestProvenance,string>={
 recorded:"Recorded adventure",
 historical_reconstructed:"Reconstructed adventure"
};
export function questProvenanceDisclosure(value:QuestProvenance):string{
 return value==="recorded"
  ?"Based on events captured by the WoW Comic Chronicle addon. Cinematic dialogue and transitions may be dramatized."
  :"Reconstructed from available quest completion information. Specific encounters, dialogue, combat and equipment may not have been recorded; dramatized scenes are not a factual gameplay log.";
}
export function historicalStoryInstructions(value:QuestProvenance):string{
 return value==="recorded"
  ?"Follow the recorded sequence and distinguish dramatic embellishments from factual game events."
  :"Only assert quest completion when verified by game data. Do not assert unrecorded boss kills, NPC meetings, loot, equipment, travel routes, combat or exact dialogue as facts. Build atmosphere and plausible connective scenes, and clearly label the result as reconstructed.";
}
