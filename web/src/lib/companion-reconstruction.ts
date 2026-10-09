import {z} from "zod";
export const companionReconstructionSchema=z.discriminatedUnion("choice",[
 z.object({choice:z.literal("companion"),companionId:z.string().uuid()}),
 z.object({choice:z.literal("none")})
]);
export type CompanionReconstruction=z.infer<typeof companionReconstructionSchema>;
export type CompanionEvidence={kind:"recorded";companionId:string|null}|{kind:"missing"};
export type CompanionDecision={
 companionId:string|null;
 provenance:"recorded"|"player_reconstructed";
 disclosure:string|null;
};
export function resolveCompanionForQuest(
 evidence:CompanionEvidence,
 reconstruction?:CompanionReconstruction
):CompanionDecision{
 if(evidence.kind==="recorded")return {companionId:evidence.companionId,provenance:"recorded",disclosure:null};
 if(!reconstruction)throw new Error("Player must choose a companion or no companion before generation");
 return {
  companionId:reconstruction.choice==="companion"?reconstruction.companionId:null,
  provenance:"player_reconstructed",
  disclosure:"Companion details were reconstructed from the player's selection, not verified gameplay records."
 };
}
