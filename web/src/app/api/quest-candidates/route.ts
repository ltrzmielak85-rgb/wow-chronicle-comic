import {NextRequest,NextResponse} from "next/server";
import {userClient} from "@/lib/supabase";
import {z} from "zod";
export async function GET(req:NextRequest){
 const token=req.headers.get("authorization")?.replace(/^Bearer /i,"");
 if(!token)return NextResponse.json({error:"Authentication required"},{status:401});
 const characterId=req.nextUrl.searchParams.get("characterId");
 if(!z.string().uuid().safeParse(characterId).success)return NextResponse.json({error:"Valid characterId required"},{status:400});
 const db=userClient(token);
 const {data:{user},error:authError}=await db.auth.getUser(token);
 if(authError||!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 const {data,error}=await db.from("quest_candidates")
  .select("id,quest_id,quest_title,completed_at,status")
  .eq("user_id",user.id).eq("character_id",characterId!)
  .order("completed_at",{ascending:false}).limit(100);
 if(error)return NextResponse.json({error:"Could not load quests"},{status:500});
 return NextResponse.json({quests:data??[]});
}
