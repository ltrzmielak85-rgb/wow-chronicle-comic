import {describe,it,expect} from "vitest";
import {createShareToken,matchesShareToken,shareIsActive} from "./comic-sharing";
describe("revocable comic share links",()=>{
 it("creates a random opaque token stored as a hash",()=>{const {token,tokenHash}=createShareToken();expect(token).not.toBe(tokenHash);expect(matchesShareToken(token,tokenHash)).toBe(true);expect(matchesShareToken(token+"x",tokenHash)).toBe(false);});
 it("blocks revoked or expired links",()=>{expect(shareIsActive({revoked_at:"2026-01-01T00:00:00Z",expires_at:null})).toBe(false);expect(shareIsActive({revoked_at:null,expires_at:"2026-01-01T00:00:00Z"},new Date("2026-02-01T00:00:00Z"))).toBe(false);});
});
