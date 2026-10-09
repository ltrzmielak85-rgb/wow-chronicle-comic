/** Deterministic quest timeline extraction, independent of any AI model. */
export type RecordedEvent = {seq:number;timestamp:string;type:string;data:Record<string,unknown>;zone?:string};
export type QuestStory = {questId:number;title:string|null;events:RecordedEvent[];completed:boolean};
export function buildQuestStories(events:RecordedEvent[]):QuestStory[]{
  const sorted=[...events].sort((a,b)=>a.timestamp.localeCompare(b.timestamp)||a.seq-b.seq);
  const stories=new Map<number,QuestStory>();
  const active=new Set<number>();
  for(const e of sorted){
    const idValue=e.data.questID??e.data.id??e.data.questId;
    const id=typeof idValue==="number"?idValue:Number(idValue);
    const type=e.type.toLowerCase();
    if(Number.isInteger(id)&&id>0){
      let story=stories.get(id);
      if(!story){story={questId:id,title:typeof e.data.title==="string"?e.data.title:null,events:[],completed:false};stories.set(id,story);}
      if(!story.title&&typeof e.data.title==="string")story.title=e.data.title;
      story.events.push(e);
      if(type.includes("accept")||type.includes("seen"))active.add(id);
      if(type.includes("turned_in")){story.completed=true;active.delete(id);}
    }else if(active.size){
      for(const questId of active)stories.get(questId)?.events.push(e);
    }
  }
  return [...stories.values()];
}
