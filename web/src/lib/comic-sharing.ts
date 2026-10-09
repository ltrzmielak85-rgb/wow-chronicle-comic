import {createHash,randomBytes,timingSafeEqual} from "node:crypto";
export function createShareToken(){
 const token=randomBytes(32).toString("base64url");
 return {token,tokenHash:hashShareToken(token)};
}
export function hashShareToken(token:string):string{
 return createHash("sha256").update(token,"utf8").digest("hex");
}
export function matchesShareToken(token:string,expectedHash:string):boolean{
 if(!/^[a-f0-9]{64}$/.test(expectedHash))return false;
 const a=Buffer.from(hashShareToken(token),"hex"),b=Buffer.from(expectedHash,"hex");
 return timingSafeEqual(a,b);
}
export function shareIsActive(link:{revoked_at:string|null;expires_at:string|null},now=new Date()):boolean{
 return !link.revoked_at&&(!link.expires_at||new Date(link.expires_at).getTime()>now.getTime());
}
