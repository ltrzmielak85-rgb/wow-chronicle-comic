import {describe,it,expect} from "vitest";
import {decideGenerationOutcome} from "./generation-state";
describe("all-or-nothing generation",()=>{
 it("publishes only on full success",()=>expect(decideGenerationOutcome("success",1)).toMatchObject({publish:true,nextStatus:"completed"}));
 it("retries without charging on temporary failures",()=>expect(decideGenerationOutcome("retryable_failure",1)).toMatchObject({retry:true,publish:false,releaseCredits:false}));
 it("releases all credits after final failure",()=>expect(decideGenerationOutcome("retryable_failure",3)).toMatchObject({retry:false,releaseCredits:true,publish:false}));
 it("does not retry terminal failures",()=>expect(decideGenerationOutcome("terminal_failure",1)).toMatchObject({retry:false,releaseCredits:true,publish:false}));
});
