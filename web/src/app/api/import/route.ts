import {NextRequest,NextResponse} from "next/server";
import {parseSavedVariables} from "@/lib/lua-savedvariables";
import {userClient} from "@/lib/supabase";
import {z} from "zod";
const eventSchema=z.object({seq:z.coerce.number().int().nonnegative(),ts:z.coerce.number().int().nonnegative().optional(),timestamp:z.coerce.number().int().nonnegative().optional(),kind:z.string().optional(),type:z.string().optional(),data:z.record(z.string(),z.unknown()).optional()});
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
  const events=Object.values(raw).map(e=>eventSchema.parse(e)).slice(0,5000);
  const {data:character,error}=await db.from("characters").upsert({user_id:user.id,name,realm,game_version:"tbc-anniversary"},{onConflict:"user_id,realm,name,game_version"}).select("id").single();
  if(error||!character)return NextResponse.json({error:"Could not save character"},{status:500});
  const rows=events.map(e=>({character_id:character.id,seq:e.seq,event_time:new Date((e.ts??e.timestamp??0)*1000).toISOString(),event_type:e.kind??e.type??"unknown",payload:e.data??{}}));
  if(rows.length){const {error:saveError}=await db.from("adventure_events").upsert(rows,{onConflict:"character_id,seq",ignoreDuplicates:true});if(saveError)return NextResponse.json({error:"Could not save events"},{status:500});}
  return NextResponse.json({characterId:character.id,received:rows.length});
 }catch{return NextResponse.json({error:"Invalid SavedVariables file"},{status:400});}
}
