import { NextRequest,NextResponse } from "next/server";
import { userClient } from "@/lib/supabase";
import { z } from "zod";
const payload = z.object({
 characterName:z.string().min(1).max(80),
 realm:z.string().min(1).max(100),
 gameVersion:z.string().max(40).default("tbc-anniversary"),
 events:z.array(z.object({seq:z.number().int().nonnegative(),ts:z.number().int().nonnegative(),kind:z.string().max(100),data:z.record(z.string(),z.unknown()).default({})})).max(5000)
});
export async function POST(req:NextRequest){
 try{
  const token=req.headers.get("authorization")?.replace(/^Bearer /i,"");
  if(!token)return NextResponse.json({error:"Unauthorized"},{status:401});
  const client=userClient(token);
  const {data:{user},error:authError}=await client.auth.getUser(token);
  if(authError||!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const input=payload.parse(await req.json());
  const {data:character,error:characterError}=await client.from("characters").upsert({user_id:user.id,name:input.characterName,realm:input.realm,game_version:input.gameVersion},{onConflict:"user_id,realm,name,game_version"}).select("id").single();
  if(characterError||!character)return NextResponse.json({error:"Character save failed"},{status:500});
  const events=input.events.map(e=>({character_id:character.id,seq:e.seq,event_time:new Date(e.ts*1000).toISOString(),event_type:e.kind,payload:e.data}));
  if(events.length){
   const {error}=await client.from("adventure_events").upsert(events,{onConflict:"character_id,seq",ignoreDuplicates:true});
   if(error)return NextResponse.json({error:"Event save failed"},{status:500});
  }
  return NextResponse.json({characterId:character.id,received:events.length});
 }catch(e){if(e instanceof z.ZodError)return NextResponse.json({error:"Invalid upload",details:e.issues},{status:400});return NextResponse.json({error:"Upload failed"},{status:500});}
}
