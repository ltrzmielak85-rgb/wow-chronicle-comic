import {z} from "zod";
export const companionObservationSchema=z.object({
 characterId:z.string().uuid(),
 companionId:z.string().uuid().nullable(),
 observedAt:z.string().datetime(),
 sourceEventSeq:z.number().int().nonnegative().nullable().optional(),
 observationKind:z.enum(["active","none","unknown"])
}).refine(v=>(v.observationKind==="active")===(v.companionId!==null),{message:"Active observations require a companion ID"});
export type CompanionObservation=z.infer<typeof companionObservationSchema>;
/** Only evidence at or before quest completion may establish an active companion. */
export function companionAtQuest(observations:CompanionObservation[],questCompletedAt:string):string|null{
 const at=Date.parse(questCompletedAt);
 if(!Number.isFinite(at))throw new Error("Invalid quest completion time");
 const latest=observations.filter(o=>Date.parse(o.observedAt)<=at)
  .sort((a,b)=>Date.parse(b.observedAt)-Date.parse(a.observedAt))[0];
 return latest?.observationKind==="active"?latest.companionId:null;
}
export function companionVisualDirection(companionName:string|null,referenceImagePath:string|null):string{
 if(!companionName)return "No historically verified active companion; do not invent a named recurring pet or demon.";
 return referenceImagePath
  ?`Recurring companion ${JSON.stringify(companionName)}: use its approved reference image to preserve appearance across panels; show only when the recorded scene supports its presence.`
  :`Recorded companion ${JSON.stringify(companionName)}; appearance is not approved, so avoid asserting unverified visual details.`;
}
