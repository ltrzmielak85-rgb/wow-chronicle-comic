import {describe,it,expect} from "vitest";
import {generationSelectionSchema,quoteComicPages} from "./generation-quote";
describe("comic generation quote",()=>{
 it("charges one credit per page",()=>{expect(quoteComicPages(3,"quest").credits).toBe(3);expect(quoteComicPages(20,"chapter").credits).toBe(20)});
 it("enforces quest range",()=>{for(const n of [0,6,1.5,NaN])expect(()=>quoteComicPages(n,"quest")).toThrow();expect(quoteComicPages(1,"quest").credits).toBe(1);});
 it("enforces chapter range",()=>{for(const n of [4,21,5.5,NaN])expect(()=>quoteComicPages(n,"chapter")).toThrow();expect(quoteComicPages(5,"chapter").credits).toBe(5);});
 it("requires chapter id for chapter requests",()=>expect(generationSelectionSchema.safeParse({kind:"chapter",candidateId:"x",pages:5,idempotencyKey:"x"}).success).toBe(false));
});
