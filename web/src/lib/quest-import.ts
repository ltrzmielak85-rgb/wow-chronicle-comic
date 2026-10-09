import {z} from "zod";
import {completedQuestCandidates} from "./quest-candidates";
import type {RecordedEvent} from "./quest-timeline";
export const importedEventSchema=z.object({
 seq:z.coerce.number().int().nonnegative(),
 ts:z.coerce.number().int().positive().optional(),
 timestamp:z.coerce.number().int().positive().optional(),
 kind:z.string().min(1).max(100).optional(),
 type:z.string().min(1).max(100).optional(),
 data:z.record(z.string(),z.unknown()).default({})
}).refine(e=>(e.ts??e.timestamp)!==undefined&&!!(e.kind??e.type),"Event requires time and type");
export function normalizeImportedEvents(raw:unknown){
 if(!raw||typeof raw!=="object"||Array.isArray(raw))throw new Error("Events must be a Lua table");
 const values=Object.values(raw);
 if(values.length>5000)throw new Error("Too many events");
 const events=values.map(e=>importedEventSchema.parse(e));
 const seq=new Set<number>();
 for(const e of events){if(seq.has(e.seq))throw new Error("Duplicate event sequence");seq.add(e.seq);}
 return events.sort((a,b)=>a.seq-b.seq).map(e=>{
  const time=new Date((e.ts??e.timestamp!)*1000);
  if(!Number.isFinite(time.getTime())||time.getUTCFullYear()<2004||time.getUTCFullYear()>2100)throw new Error("Invalid event timestamp");
  return {seq:e.seq,event_time:time.toISOString(),event_type:e.kind??e.type!,payload:e.data};
 });
}
export function previewCandidates(rows:ReturnType<typeof normalizeImportedEvents>){
 const timeline:RecordedEvent[]=rows.map(e=>({seq:e.seq,timestamp:e.event_time,type:e.event_type,data:e.payload}));
 return completedQuestCandidates(timeline);
}
