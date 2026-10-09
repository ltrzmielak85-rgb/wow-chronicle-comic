import {describe,it,expect} from "vitest";
import {chapterPackageQuote,chapterCoverPrompt} from "./chapter-cover";
describe("included chapter cover",()=>{
 it("does not charge for the extra cover",()=>expect(chapterPackageQuote(5)).toMatchObject({credits:5,storyPages:5,coverPages:1,totalImages:6,coverCredits:0}));
 it("supports a 20-page chapter",()=>expect(chapterPackageQuote(20)).toMatchObject({credits:20,totalImages:21}));
 it("rejects quest-size chapters",()=>expect(()=>chapterPackageQuote(4)).toThrow());
 it("uses chapter title and reference sheet",()=>expect(chapterCoverPrompt({chapterTitle:"Echo Isles",setting:"Echo Isles",approvedCharacterReferencePath:"private/ref.png",artStyle:"dark_cinematic"})).toContain("Echo Isles"));
});
