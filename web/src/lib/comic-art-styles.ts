import { z } from "zod";
export const artStyleSchema=z.enum(["classic_fantasy_comic","dark_cinematic","vibrant_adventure"]);
export type ArtStyle=z.infer<typeof artStyleSchema>;
export const ART_STYLES:Record<ArtStyle,{name:string;direction:string}>={
 classic_fantasy_comic:{name:"Classic Fantasy Comic",direction:"Hand-inked fantasy graphic novel, expressive linework, painterly colors, readable action, balanced dramatic lighting."},
 dark_cinematic:{name:"Dark Cinematic",direction:"Moody high-contrast fantasy graphic novel, restrained palette, deep shadows, atmospheric lighting, dramatic framing; retain readable faces and action."},
 vibrant_adventure:{name:"Vibrant Adventure",direction:"Bright adventurous fantasy comic, saturated but controlled colors, expressive poses, inviting atmosphere and clear panel storytelling."}
};
export function artDirection(style:ArtStyle,continuity:string):string{
 return [ART_STYLES[style].direction,"Maintain the same character identity, facial structure, skin tone, hairstyle, distinctive markings and silhouette across all panels.",continuity,"Style may change lighting, palette and rendering, but never the character's defining traits."].join("\n");
}
