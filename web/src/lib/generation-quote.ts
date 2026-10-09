import {z} from "zod";

export const generationSelectionSchema=z.object({
 candidateId:z.string().uuid(),
 pages:z.number().int().min(1).max(5),
 idempotencyKey:z.string().uuid()
});
export type GenerationSelection=z.infer<typeof generationSelectionSchema>;
export type CreditQuote={pages:number;credits:number;label:string};
export function quoteComicPages(pages:number):CreditQuote{
 if(!Number.isInteger(pages)||pages<1||pages>5)throw new Error("Select between 1 and 5 pages");
 return {pages,credits:pages,label:`${pages} ${pages===1?"page":"pages"} · ${pages} ${pages===1?"credit":"credits"}`};
}
