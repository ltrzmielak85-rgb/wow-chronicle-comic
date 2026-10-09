import {z} from "zod";
export const dialogueLineSchema=z.object({
 speaker:z.string().trim().min(1).max(80),
 line:z.string().trim().min(1).max(220),
 provenance:z.enum(["recorded","cinematic_original"]),
 sourceEventSeq:z.number().int().nonnegative().nullable()
}).superRefine((line,ctx)=>{
 if(line.provenance==="recorded"&&line.sourceEventSeq===null)
  ctx.addIssue({code:"custom",message:"Recorded dialogue must cite a source event"});
});
export type DialogueLine=z.infer<typeof dialogueLineSchema>;
export function dialogueGenerationInstructions():string{
 return [
  "Write cinematic, lore-faithful Warcraft dialogue with concise speech balloons.",
  "Preserve recorded quest facts, NPC identity, important dialogue and event chronology.",
  "You may invent plausible character conversations, reactions and narration, but do not present invented lines as verbatim quest text.",
  "Tag each line as recorded only when its wording is supported by a recorded event; otherwise tag cinematic_original.",
  "Never invent quest completion, loot, boss kills, named NPC encounters, or new locations as recorded achievements.",
  "Original dialogue must not contradict the supplied quest text or imply an unrecorded accomplishment."
 ].join("\n");
}
