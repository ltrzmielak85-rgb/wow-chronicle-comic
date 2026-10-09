import {z} from "zod";
export const comicPageView=z.object({pageNumber:z.number().int().positive(),imageUrl:z.string().url()});
export const comicReaderData=z.object({title:z.string().min(1),pages:z.array(comicPageView).min(1)});
export type ComicReaderData=z.infer<typeof comicReaderData>;
export function orderedPages(data:ComicReaderData){return [...data.pages].sort((a,b)=>a.pageNumber-b.pageNumber);}
export function safeDownloadName(title:string,extension:"pdf"|"png"|"jpg"){
 const base=title.normalize("NFKD").replace(/[^a-zA-Z0-9 _-]/g,"").trim().replace(/\s+/g,"-").slice(0,80)||"comic";
 return `${base}.${extension}`;
}
