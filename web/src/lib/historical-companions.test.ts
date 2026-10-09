import {describe,it,expect} from "vitest";
import {companionAtQuest,companionObservationSchema,companionVisualDirection} from "./historical-companions";
const c="00000000-0000-4000-8000-000000000001",p="00000000-0000-4000-8000-000000000002";
const observations=[{characterId:c,companionId:p,observedAt:"2026-01-01T00:00:00Z",observationKind:"active" as const},{characterId:c,companionId:null,observedAt:"2026-02-01T00:00:00Z",observationKind:"none" as const}];
describe("historical companions",()=>{
 it("uses active pet before dismissal",()=>expect(companionAtQuest(observations,"2026-01-15T00:00:00Z")).toBe(p));
 it("does not borrow a pet from the future",()=>expect(companionAtQuest(observations,"2025-12-01T00:00:00Z")).toBeNull());
 it("respects dismissed pets",()=>expect(companionAtQuest(observations,"2026-03-01T00:00:00Z")).toBeNull());
 it("rejects active without a companion",()=>expect(companionObservationSchema.safeParse({...observations[0],companionId:null}).success).toBe(false));
 it("uses approved reference for continuity",()=>expect(companionVisualDirection("Tiger","pets/tiger.png")).toContain("approved reference"));
});
