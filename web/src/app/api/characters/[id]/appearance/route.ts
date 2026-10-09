import {NextRequest,NextResponse} from "next/server";
import {userClient} from "@/lib/supabase";
import {characterAppearanceSchema} from "@/lib/character-appearance";
import {z} from "zod";
type Ctx={params:Promise<{id:string}>};
async function authorized(req:NextRequest,id:string){
 const token=req.headers.get("authorization")?.replace(/^Bearer /i,"");
 if(!token)return null;
 const db=userClient(token);
 const {data:{user}}=await db.auth.getUser(token);
 if(!user)return null;
 const {data:character}=await db.from("characters").select("id").eq("id",id).eq("user_id",user.id).maybeSingle();
 return character?db:null;
}
export async function GET(req:NextRequest,{params}:Ctx){
 const {id}=await params;
 if(!z.string().uuid().safeParse(id).success)return NextResponse.json({error:"Invalid character ID"},{status:400});
 const db=await authorized(req,id);
 if(!db)return NextResponse.json({error:"Unauthorized"},{status:401});
 const {data,error}=await db.from("character_appearances").select("*").eq("character_id",id).maybeSingle();
 if(error)return NextResponse.json({error:"Unable to load appearance"},{status:500});
 return NextResponse.json({appearance:data});
}
export async function PUT(req:NextRequest,{params}:Ctx){
 const {id}=await params;
 if(!z.string().uuid().safeParse(id).success)return NextResponse.json({error:"Invalid character ID"},{status:400});
 const db=await authorized(req,id);
 if(!db)return NextResponse.json({error:"Unauthorized"},{status:401});
 try{
  const input=characterAppearanceSchema.omit({reference_image_path:true,reference_version:true}).parse(await req.json());
  const {data:old}=await db.from("character_appearances").select("reference_image_path,reference_version").eq("character_id",id).maybeSingle();
  const {data,error}=await db.from("character_appearances").upsert({character_id:id,...input,reference_image_path:old?.reference_image_path??null,reference_version:old?.reference_version??1},{onConflict:"character_id"}).select("*").single();
  if(error)return NextResponse.json({error:"Unable to save appearance"},{status:500});
  return NextResponse.json({appearance:data});
 }catch{return NextResponse.json({error:"Invalid appearance profile"},{status:400});}
}
