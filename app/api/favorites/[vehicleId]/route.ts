import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
export async function POST(_:Request,{params}:{params:Promise<{vehicleId:string}>}){const user=await getCurrentUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});const {vehicleId}=await params;await db.favorite.upsert({where:{userId_vehicleId:{userId:user.id,vehicleId}},update:{},create:{userId:user.id,vehicleId}});return NextResponse.json({ok:true});}
export async function DELETE(_:Request,{params}:{params:Promise<{vehicleId:string}>}){const user=await getCurrentUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});const {vehicleId}=await params;await db.favorite.deleteMany({where:{userId:user.id,vehicleId}});return NextResponse.json({ok:true});}
