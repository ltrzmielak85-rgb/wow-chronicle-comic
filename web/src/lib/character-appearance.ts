import { z } from "zod";

export const characterAppearanceSchema=z.object({
 race:z.string().trim().max(60).nullable().optional(),
 class:z.string().trim().max(60).nullable().optional(),
 gender:z.string().trim().max(60).nullable().optional(),
 appearance_description:z.string().trim().max(1200).default(""),
 equipment_summary:z.string().trim().max(1200).default(""),
 reference_image_path:z.string().max(500).nullable().optional(),
 reference_version:z.number().int().positive().default(1)
});
export type CharacterAppearance=z.infer<typeof characterAppearanceSchema>;

export function characterContinuityPrompt(characterName:string,appearance:CharacterAppearance){
 const descriptors=[
  `The recurring protagonist is ${JSON.stringify(characterName)}.`,
  appearance.race?`Race: ${appearance.race}.`:"",
  appearance.class?`Class: ${appearance.class}.`:"",
  appearance.gender?`Gender: ${appearance.gender}.`:"",
  appearance.appearance_description?`Stable physical features: ${appearance.appearance_description}.`:"",
  appearance.equipment_summary?`Recorded equipment: ${appearance.equipment_summary}.`:"",
  appearance.reference_image_path?`An optional approved reference image is available (version ${appearance.reference_version}); preserve the visible features shown there.`:"",
  "Keep face, tusks, skin tone, hairstyle, body shape, and identifying marks consistent across panels.",
  "Equipment may change only when new recorded equipment information is provided.",
  "If details are missing, choose restrained visual defaults and do not present them as recorded facts."
 ];
 return descriptors.filter(Boolean).join("\n");
}
