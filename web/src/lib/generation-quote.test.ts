import {describe,it,expect} from "vitest";
import {quoteComicPages} from "./generation-quote";
describe("comic generation quote",()=>{
 it("quotes one credit per page",()=>expect(quoteComicPages(3)).toMatchObject({pages:3,credits:3}));
 it("accepts minimum and maximum",()=>{expect(quoteComicPages(1).credits).toBe(1);expect(quoteComicPages(5).credits).toBe(5)});
 it("rejects out-of-range and fractional pages",()=>{for(const n of [0,6,1.5,NaN])expect(()=>quoteComicPages(n)).toThrow()});
});
