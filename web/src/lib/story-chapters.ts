import {z} from "zod";
export const chapterSelectionSchema=z.object({
 title:z.string().trim().min(1).max(160),
 candidateIds:z.array(z.string().uuid()).min(2).max(30)
}).refine(x=>new Set(x.candidateIds).size===x.candidateIds.length,{message:"Duplicate quest selections"});
export type ChapterQuest={id:string;characterId:string;completedAt:string|null;provenance:"recorded"|"historical_reconstructed"};
export function arrangeChapterQuests(quests:ChapterQuest[],characterId:string){
 if(quests.length<2)throw new Error("A chapter requires at least two completed quests");
 if(quests.some(q=>q.characterId!==characterId))throw new Error("All quests must belong to the same character");
 return [...quests].sort((a,b)=>{
  if(a.completedAt===null)return 1;
  if(b.completedAt===null)return -1;
  return Date.parse(a.completedAt)-Date.parse(b.completedAt);
 });
}
export function chapterDisclosure(quests:ChapterQuest[]){
 return quests.some(q=>q.provenance==="historical_reconstructed")
  ?"This chapter includes reconstructed quests. Scenes without recorded events are dramatized, not a factual gameplay log."
  :"Based on recorded quests; cinematic scenes may be dramatized.";
}
