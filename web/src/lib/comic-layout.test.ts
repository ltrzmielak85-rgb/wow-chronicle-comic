import {describe,it,expect} from "vitest";
import {selectAdaptiveLayout,layoutSchema} from "./comic-layout";
describe("adaptive layout",()=>{
 it("uses standard panels for ordinary beats",()=>{const p=selectAdaptiveLayout([1,2,3,4].map(panelNumber=>({panelNumber,importance:"normal" as const})));expect(p.kind).toBe("standard");expect(layoutSchema.parse(p).panels).toHaveLength(4);});
 it("emphasizes a climax",()=>{const p=selectAdaptiveLayout([{panelNumber:1,importance:"normal"},{panelNumber:2,importance:"climax"},{panelNumber:3,importance:"normal"}]);expect(p.kind).toBe("hero");expect(p.panels[1].role).toBe("hero");});
 it("uses splash for one moment",()=>expect(selectAdaptiveLayout([{panelNumber:1,importance:"major"}]).kind).toBe("splash"));
 it("rejects duplicate panels",()=>expect(()=>selectAdaptiveLayout([{panelNumber:1,importance:"normal"},{panelNumber:1,importance:"major"}])).toThrow());
});
