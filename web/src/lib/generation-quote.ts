import {z} from "zod";
export const generationSelectionSchema=z.discriminatedUnion("kind",[
 z.object({kind:z.literal("quest"),candidateId:z.string().uuid(),pages:z.number().int().min(1).max(5),idempotencyKey:z.string().uuid()}),
 z.object({kind:z.literal("chapter"),chapterId:z.string().uuid(),pages:z.number().int().min(5).max(20),idempotencyKey:z.string().uuid()})
]);
export type GenerationSelection=z.infer<typeof generationSelectionSchema>;
export type CreditQuote={pages:number;credits:number;label:string};
export function quoteComicPages(pages:number,kind:"quest"|"chapter"="quest"):CreditQuote{
 const min=kind==="quest"?1:5,max=kind==="quest"?5:20;
 if(!Number.isInteger(pages)||pages<min||pages>max)throw new Error(`Select between ${min} and ${max} pages for a ${kind}`);
 return {pages,credits:pages,label:`${pages} ${pages===1?"page":"pages"} · ${pages} ${pages===1?"credit":"credits"}`};
}
