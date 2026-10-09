import type {RecordedEvent} from "./quest-timeline";
export type Candidate={questId:number;title:string|null;completedAt:string;completionSeq:number};
/** Deterministically identify quest turn-ins; never generate or spend a credit here. */
export function completedQuestCandidates(events:RecordedEvent[]):Candidate[]{
 const found=new Map<string,Candidate>();
 for(const e of events){
  const kind=e.type.toUpperCase();
  if(kind!=="QUEST_TURNED_IN")continue;
  const raw=e.data.questID??e.data.questId??e.data.id;
  const questId=typeof raw==="number"?raw:Number(raw);
  if(!Number.isSafeInteger(questId)||questId<=0)continue;
  const completedAt=e.timestamp;
  if(!Number.isFinite(Date.parse(completedAt)))continue;
  const key=`${questId}:${completedAt}`;
  found.set(key,{questId,title:typeof e.data.title==="string"?e.data.title:null,completedAt,completionSeq:e.seq});
 }
 return [...found.values()].sort((a,b)=>b.completedAt.localeCompare(a.completedAt)||b.completionSeq-a.completionSeq);
}
