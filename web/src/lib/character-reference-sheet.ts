import {z} from "zod";
import {appearanceAtQuest, type AppearanceSnapshot} from "./character-history";
import {characterContinuityPrompt, type CharacterAppearance} from "./character-appearance";

export const characterReferenceSheetSchema=z.object({
 characterId:z.string().uuid(),
 identityVersion:z.number().int().positive(),
 referenceImagePath:z.string().min(1).max(500),
 approvedAt:z.string().datetime(),
 identityDescription:z.string().min(1).max(1200)
});
export type CharacterReferenceSheet=z.infer<typeof characterReferenceSheetSchema>;
export type HistoricalReferenceDirection={
 referenceImagePath:string;
 referenceVersion:number;
 prompt:string;
 historicalSnapshot:AppearanceSnapshot|null;
};
/** Identity sheet is stable; equipment comes only from snapshots at or before the quest. */
export function historicalReferenceDirection(
 sheet:CharacterReferenceSheet,
 appearance:CharacterAppearance,
 snapshots:AppearanceSnapshot[],
 completedAt:string,
 characterName:string
):HistoricalReferenceDirection{
 const snapshot=appearanceAtQuest(snapshots,completedAt);
 const identityOnly={...appearance,equipment_summary:"",reference_image_path:sheet.referenceImagePath,reference_version:sheet.identityVersion};
 const lines=[
  characterContinuityPrompt(characterName,identityOnly),
  `Approved reference sheet identity: ${sheet.identityDescription}.`,
  snapshot
   ?`Historical equipment and level at this quest (only recorded values): ${JSON.stringify({level:snapshot.level??null,equipment:snapshot.equipment})}.`
   :"No historical equipment evidence: do not copy current gear or assert specific equipment.",
  "Use the approved sheet for facial features, tusks, skin tone, hairstyle, silhouette and identifying marks only.",
  "If the sheet depicts newer armor or weapons, replace them with the historical equipment; do not transfer future gear.",
  "Keep the same character identity across every panel and page."
 ];
 return {referenceImagePath:sheet.referenceImagePath,referenceVersion:sheet.identityVersion,prompt:lines.join("\n"),historicalSnapshot:snapshot};
}
