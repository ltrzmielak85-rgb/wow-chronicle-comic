import {describe,it,expect} from "vitest";
import {parseSavedVariables} from "./lua-savedvariables";
import {normalizeImportedEvents,previewCandidates} from "./quest-import";
describe("Lua SavedVariables → completed quest",()=>{
 it("parses an actual SavedVariables table and identifies turn-in",()=>{
  const lua='WCC_DB = { ["seq"] = 2, ["events"] = { [1] = { ["seq"] = 1, ["ts"] = 1791590400, ["kind"] = "QUEST_SEEN", ["data"] = { ["id"] = 100, ["title"] = "Trial" } }, [2] = { ["seq"] = 2, ["ts"] = 1791590500, ["kind"] = "QUEST_TURNED_IN", ["data"] = { ["questID"] = 100, ["title"] = "Trial" } } } }';
  const data=parseSavedVariables(lua);
  expect(previewCandidates(normalizeImportedEvents(data.events))).toMatchObject([{questId:100,title:"Trial"}]);
 });
 it("rejects executable Lua expressions",()=>expect(()=>parseSavedVariables('WCC_DB = os.execute("echo unsafe")')).toThrow());
});
