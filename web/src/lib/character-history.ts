import {z} from "zod";
export const appearanceSnapshot=z.object({
 observedAt:z.string().datetime(),
 sourceEventSeq:z.number().int().nonnegative().nullable().optional(),
 level:z.number().int().min(1).max(100).nullable().optional(),
 race:z.string().max(60).nullable().optional(),
 className:z.string().max(60).nullable().optional(),
 gender:z.string().max(60).nullable().optional(),
 appearanceDescription:z.string().max(1200).nullable().optional(),
 equipment:z.record(z.string(),z.unknown()).default({}),
 referenceImagePath:z.string().nullable().optional()
});
export type AppearanceSnapshot=z.infer<typeof appearanceSnapshot>;
/** Never use future gear when illustrating a past quest. */
export function appearanceAtQuest(snapshots:AppearanceSnapshot[],questCompletedAt:string):AppearanceSnapshot|null{
 const when=Date.parse(questCompletedAt);
 if(!Number.isFinite(when))throw new Error("Invalid quest completion timestamp");
 return [...snapshots].filter(s=>Number.isFinite(Date.parse(s.observedAt))&&Date.parse(s.observedAt)<=when)
 .sort((a,b)=>Date.parse(b.observedAt)-Date.parse(a.observedAt))[0]??null;
}
export function historicalAppearanceDirection(snapshot:AppearanceSnapshot|null,stableIdentity:string):string{
 return [
  "Preserve the protagonist's defining identity: "+stableIdentity,
  snapshot?`Use only appearance known at this point in the timeline: ${JSON.stringify(snapshot)}`:
   "No historical equipment snapshot exists; avoid inventing specific named gear or implying that current gear was worn in the past.",
  "Do not use future equipment or levels in earlier quest scenes."
 ].join("\n");
}
