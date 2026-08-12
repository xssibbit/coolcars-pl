import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const optionalShort=z.string().trim().min(1).max(120).optional();
const schema=z.object({
  vehicleId:z.string().min(1),name:z.string().min(2),email:z.string().email(),phone:z.string().optional(),message:z.string().min(5),
  visitorId:z.string().min(8).max(80).optional(),source:optionalShort,medium:optionalShort,campaign:optionalShort,
  firstSource:optionalShort,firstMedium:optionalShort,firstCampaign:optionalShort,
  landingPath:z.string().trim().min(1).max(300).optional(),referrerHost:optionalShort,
});

export async function POST(request:Request){
  const parsed=schema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({error:'Invalid data'},{status:400});
  const user=await getCurrentUser();
  const vehicle=await db.vehicle.findUnique({where:{id:parsed.data.vehicleId},select:{id:true}});
  if(!vehicle)return NextResponse.json({error:'Vehicle not found'},{status:404});
  const {vehicleId,name,email,phone,message,visitorId,source,medium,campaign,firstSource,firstMedium,firstCampaign,landingPath,referrerHost}=parsed.data;
  const inquiry=await db.$transaction(async tx=>{
    const created=await tx.inquiry.create({data:{vehicleId,name,email,phone,message,userId:user?.id,visitorId,source,medium,campaign,firstSource,firstMedium,firstCampaign,landingPath}});
    await tx.analyticsEvent.create({data:{type:'INQUIRY',vehicleId,userId:user?.id,visitorId,source,medium,campaign,firstSource,firstMedium,firstCampaign,landingPath,referrerHost}});
    return created;
  });
  return NextResponse.json({ok:true,id:inquiry.id},{status:201});
}
