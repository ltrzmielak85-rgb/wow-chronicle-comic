import {describe,it,expect} from "vitest";
import {historicalReferenceDirection} from "./character-reference-sheet";
const sheet={characterId:"00000000-0000-4000-8000-000000000001",identityVersion:1,referenceImagePath:"characters/hero/sheet.png",approvedAt:"2026-10-01T00:00:00Z",identityDescription:"Blue skin and long tusks"};
const appearance={race:"Troll",class:"Hunter",appearance_description:"Blue skin and long tusks",equipment_summary:"Epic future bow",reference_version:1};
const snapshots=[{observedAt:"2026-01-01T00:00:00Z",equipment:{weapon:"Old bow"}},{observedAt:"2026-11-01T00:00:00Z",equipment:{weapon:"Future bow"}}];
describe("historical character reference",()=>{
 it("keeps identity but only uses period-correct gear",()=>{
  const result=historicalReferenceDirection(sheet,appearance,snapshots,"2026-02-01T00:00:00Z","Hero");
  expect(result.prompt).toContain("Old bow");
  expect(result.prompt).not.toContain("Epic future bow");
  expect(result.prompt).not.toContain("Future bow");
  expect(result.referenceImagePath).toBe(sheet.referenceImagePath);
 });
 it("does not invent gear without historical evidence",()=>{
  const result=historicalReferenceDirection(sheet,appearance,snapshots,"2025-01-01T00:00:00Z","Hero");
  expect(result.historicalSnapshot).toBeNull();
  expect(result.prompt).toContain("No historical equipment evidence");
 });
});
