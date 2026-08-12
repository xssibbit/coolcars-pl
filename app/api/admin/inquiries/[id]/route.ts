import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

const schema=z.object({
  status:z.enum(["NEW","CONTACTED","INTERESTED","NEGOTIATION","WON","LOST"]).optional(),
  adminNote:z.string().max(4000).nullable().optional(),
  nextFollowUp:z.string().datetime().nullable().optional(),
});

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  const user=await getCurrentUser();
  if(!user||user.role!=="ADMIN")return NextResponse.json({error:"Forbidden"},{status:403});
  const parsed=schema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({error:"Invalid data"},{status:400});
  const {id}=await params;
  const lead=await db.inquiry.update({
    where:{id},
    data:{
      ...parsed.data,
      nextFollowUp:parsed.data.nextFollowUp===undefined?undefined:parsed.data.nextFollowUp?new Date(parsed.data.nextFollowUp):null,
    },
    select:{id:true,status:true,adminNote:true,nextFollowUp:true,updatedAt:true},
  }).catch(()=>null);
  if(!lead)return NextResponse.json({error:"Lead not found"},{status:404});
  return NextResponse.json({ok:true,lead});
}
