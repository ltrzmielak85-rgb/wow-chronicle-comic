import {NextRequest,NextResponse} from "next/server";
import {parseSavedVariables} from "@/lib/lua-savedvariables";
import {userClient} from "@/lib/supabase";
import {normalizeImportedEvents,previewCandidates} from "@/lib/quest-import";
export async function POST(req:NextRequest){
 try{
  const token=req.headers.get("authorization")?.replace(/^Bearer /i,"");
  if(!token)return NextResponse.json({error:"Authentication required"},{status:401});
  const db=userClient(token);
  const {data:{user}}=await db.auth.getUser(token);
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const form=await req.formData(), file=form.get("file");
  if(!(file instanceof File)||file.size>4_000_000)return NextResponse.json({error:"Choose a Lua file under 4MB"},{status:400});
  const name=String(form.get("characterName")||"").trim(),realm=String(form.get("realm")||"").trim();
  if(!name||name.length>80||!realm||realm.length>100)return NextResponse.json({error:"Character and realm required"},{status:400});
  const parsed=parseSavedVariables(await file.text());
  const raw=parsed.events;
  if(!raw||typeof raw!=="object")return NextResponse.json({error:"No events found"},{status:400});
  const rows=normalizeImportedEvents(raw);
  const {data:character,error}=await db.from("characters").upsert({user_id:user.id,name,realm,game_version:"tbc-anniversary"},{onConflict:"user_id,realm,name,game_version"}).select("id").single();
  if(error||!character)return NextResponse.json({error:"Could not save character"},{status:500});
  const eventRows=rows.map(e=>({...e,character_id:character.id}));
  if(eventRows.length){const {error:saveError}=await db.from("adventure_events").upsert(eventRows,{onConflict:"character_id,seq",ignoreDuplicates:true});if(saveError)return NextResponse.json({error:"Could not save events"},{status:500});}
  const {data:created,error:promotionError}=await db.rpc("refresh_quest_candidates",{p_character_id:character.id});
  if(promotionError)return NextResponse.json({error:"Events saved but quest candidate refresh failed"},{status:500});
  return NextResponse.json({characterId:character.id,received:rows.length,detectedCompletions:previewCandidates(rows).length,newCandidates:created});
 }catch{return NextResponse.json({error:"Invalid SavedVariables file"},{status:400});}
}
