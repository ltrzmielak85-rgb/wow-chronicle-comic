import {z} from "zod";
import {quoteComicPages} from "./generation-quote";
export const chapterCoverSchema=z.object({
 chapterTitle:z.string().trim().min(1).max(160),
 setting:z.string().trim().min(1).max(200),
 approvedCharacterReferencePath:z.string().min(1).max(500),
 artStyle:z.enum(["classic_fantasy","dark_cinematic","vibrant_adventure"])
});
export type ChapterCover=z.infer<typeof chapterCoverSchema>;
export function chapterPackageQuote(storyPages:number){
 const quote=quoteComicPages(storyPages,"chapter");
 return {...quote,storyPages,coverPages:1,totalImages:storyPages+1,coverCredits:0};
}
export function chapterCoverPrompt(input:ChapterCover):string{
 const cover=chapterCoverSchema.parse(input);
 return [
  "Create a dedicated illustrated fantasy comic BOOK COVER, not a story panel.",
  `Chapter title to typeset: ${JSON.stringify(cover.chapterTitle)}.`,
  `Setting: ${JSON.stringify(cover.setting)}.`,
  `Art style: ${cover.artStyle}.`,
  "Use the approved private character reference image supplied to the image renderer to preserve identity.",
  "Do not invent a quest completion, named NPC encounter, or an unrecorded victory.",
  "Keep title legible and leave room for safe text overlay if model text is unreliable."
 ].join("\n");
}
