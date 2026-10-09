import {describe,it,expect} from "vitest";
import {arrangeChapterQuests,chapterDisclosure} from "./story-chapters";
const q=(id:string,characterId:string,completedAt:string|null,provenance:"recorded"|"historical_reconstructed"="recorded")=>({id,characterId,completedAt,provenance});
describe("story chapters",()=>{
 it("orders known completions chronologically",()=>expect(arrangeChapterQuests([q("b","hero","2026-02-01"),q("a","hero","2026-01-01")],"hero").map(x=>x.id)).toEqual(["a","b"]));
 it("rejects mixed characters",()=>expect(()=>arrangeChapterQuests([q("a","hero",null),q("b","other",null)],"hero")).toThrow());
 it("discloses reconstructed chapters",()=>expect(chapterDisclosure([q("a","hero",null),q("b","hero",null,"historical_reconstructed")])).toContain("reconstructed"));
});
