import {describe,it,expect} from "vitest";
import {normalizeImportedEvents,previewCandidates} from "./quest-import";
describe("SavedVariables event normalization",()=>{
 const events={"1":{seq:1,ts:1791590400,kind:"QUEST_SEEN",data:{id:123,title:"A Trial"}},"2":{seq:2,ts:1791590500,kind:"QUEST_TURNED_IN",data:{questID:123,title:"A Trial"}}};
 it("recognizes a completed quest",()=>{
  const rows=normalizeImportedEvents(events);
  expect(previewCandidates(rows)).toMatchObject([{questId:123,title:"A Trial",completionSeq:2}]);
 });
 it("does not promote incomplete quests",()=>expect(previewCandidates(normalizeImportedEvents({"1":events["1"]}))).toEqual([]));
 it("rejects duplicate event sequences",()=>expect(()=>normalizeImportedEvents({"1":events["1"],"2":{...events["1"]}})).toThrow("Duplicate"));
 it("rejects absent timestamps",()=>expect(()=>normalizeImportedEvents({"1":{seq:1,kind:"QUEST_TURNED_IN"}})).toThrow());
});
