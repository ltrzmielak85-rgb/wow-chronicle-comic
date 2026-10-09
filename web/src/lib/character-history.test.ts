import {describe,it,expect} from "vitest";
import {appearanceAtQuest} from "./character-history";
describe("historical character progression",()=>{
 const snapshots=[
 {observedAt:"2026-01-10T12:00:00.000Z",level:10,equipment:{weapon:"bow"}},
 {observedAt:"2026-01-20T12:00:00.000Z",level:20,equipment:{weapon:"sword"}}
 ];
 it("uses gear recorded before the quest",()=>expect(appearanceAtQuest(snapshots,"2026-01-15T12:00:00.000Z")?.level).toBe(10));
 it("never borrows future equipment",()=>expect(appearanceAtQuest(snapshots,"2026-01-01T12:00:00.000Z")).toBeNull());
});
