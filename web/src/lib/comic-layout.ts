import { z } from "zod";

/** Adaptive layout plan is separate from narrative content and image rendering. */
export const layoutSchema = z.object({
  kind:z.enum(["standard","hero","splash"]),
  panels:z.array(z.object({
    panelNumber:z.number().int().positive(),
    role:z.enum(["normal","wide","hero","inset","full"]),
    importance:z.enum(["normal","major","climax"])
  })).min(1).max(8),
  rationale:z.string().max(300)
});
export type LayoutPlan=z.infer<typeof layoutSchema>;
export type Moment={panelNumber:number;importance:"normal"|"major"|"climax"};
export function selectAdaptiveLayout(moments:Moment[]):LayoutPlan {
 if(!moments.length||moments.length>8)throw new Error("Expected 1-8 story moments");
 const numbers=new Set(moments.map(m=>m.panelNumber));
 if(numbers.size!==moments.length||[...numbers].some(n=>n<1||!Number.isInteger(n)))throw new Error("Invalid panel numbering");
 if(moments.length===1)return {kind:"splash",panels:[{panelNumber:moments[0].panelNumber,role:"full",importance:moments[0].importance}],rationale:"Single pivotal moment uses a full-page illustration."};
 const climax=moments.find(m=>m.importance==="climax");
 if(climax)return {kind:"hero",panels:moments.map(m=>({panelNumber:m.panelNumber,role:m.panelNumber===climax.panelNumber?"hero":"inset",importance:m.importance})),rationale:"Climactic moment receives the largest panel."};
 const major=moments.find(m=>m.importance==="major");
 return {kind:major?"hero":"standard",panels:moments.map(m=>({panelNumber:m.panelNumber,role:major&&m.panelNumber===major.panelNumber?"wide":"normal",importance:m.importance})),rationale:major?"A major story beat receives a wide panel.":"Balanced multi-panel page."};
}
