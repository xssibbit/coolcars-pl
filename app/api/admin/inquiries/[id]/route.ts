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
  const existing=await db.inquiry.findUnique({where:{id},select:{id:true,status:true,vehicleId:true,userId:true,visitorId:true,source:true,medium:true,campaign:true,firstSource:true,firstMedium:true,firstCampaign:true,landingPath:true}});
  if(!existing)return NextResponse.json({error:"Lead not found"},{status:404});

  const lead=await db.$transaction(async tx=>{
    const updated=await tx.inquiry.update({
      where:{id},
      data:{
        ...parsed.data,
        nextFollowUp:parsed.data.nextFollowUp===undefined?undefined:parsed.data.nextFollowUp?new Date(parsed.data.nextFollowUp):null,
      },
      select:{id:true,status:true,adminNote:true,nextFollowUp:true,updatedAt:true},
    });
    if(parsed.data.status==="WON"&&existing.status!=="WON"){
      const already=await tx.analyticsEvent.findFirst({where:{type:"WON",inquiryId:id},select:{id:true}});
      if(!already)await tx.analyticsEvent.create({data:{type:"WON",inquiryId:id,vehicleId:existing.vehicleId,userId:existing.userId,visitorId:existing.visitorId,source:existing.source,medium:existing.medium,campaign:existing.campaign,firstSource:existing.firstSource,firstMedium:existing.firstMedium,firstCampaign:existing.firstCampaign,landingPath:existing.landingPath}});
    }
    return updated;
  });
  return NextResponse.json({ok:true,lead});
}
