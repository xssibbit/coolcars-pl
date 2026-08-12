import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){
  const user=await getCurrentUser();
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const {id}=await params;
  await db.savedSearch.deleteMany({where:{id,userId:user.id}});
  return NextResponse.json({ok:true});
}
