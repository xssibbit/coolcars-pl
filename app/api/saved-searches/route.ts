import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

const schema=z.object({name:z.string().trim().min(2).max(80),query:z.string().trim().max(700)});

export async function POST(request:Request){
  const user=await getCurrentUser();
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const parsed=schema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({error:"Invalid data"},{status:400});
  const search=await db.savedSearch.upsert({
    where:{userId_query:{userId:user.id,query:parsed.data.query}},
    update:{name:parsed.data.name},
    create:{userId:user.id,name:parsed.data.name,query:parsed.data.query},
  });
  return NextResponse.json({ok:true,id:search.id},{status:201});
}
