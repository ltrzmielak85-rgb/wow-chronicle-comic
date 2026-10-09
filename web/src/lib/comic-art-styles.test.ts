import {describe,it,expect} from "vitest";
import {ART_STYLES,artStyleSchema,artDirection} from "./comic-art-styles";
describe("art styles",()=>{
 it("supports exactly three presets",()=>expect(Object.keys(ART_STYLES)).toHaveLength(3));
 it("rejects unsupported styles",()=>expect(artStyleSchema.safeParse("custom").success).toBe(false));
 it("preserves continuity in every preset",()=>{for(const key of artStyleSchema.options)expect(artDirection(key,"Blue skin, white hair.")).toContain("Blue skin, white hair.");});
});
