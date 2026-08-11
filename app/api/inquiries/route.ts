import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
const schema=z.object({vehicleId:z.string().min(1),name:z.string().min(2),email:z.string().email(),phone:z.string().optional(),message:z.string().min(5)});
export async function POST(request:Request){const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:'Invalid data'},{status:400});const user=await getCurrentUser();const vehicle=await db.vehicle.findUnique({where:{id:parsed.data.vehicleId},select:{id:true}});if(!vehicle)return NextResponse.json({error:'Vehicle not found'},{status:404});await db.inquiry.create({data:{...parsed.data,userId:user?.id}});return NextResponse.json({ok:true},{status:201});}
