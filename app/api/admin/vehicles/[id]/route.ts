import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { slugify, vehicleSchema } from "@/lib/validation";
async function admin(){const u=await getCurrentUser();return !!u&&u.role==='ADMIN';}
export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}){if(!(await admin()))return NextResponse.json({error:'Brak uprawnień'},{status:403});const parsed=vehicleSchema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:'Sprawdź dane formularza',details:parsed.error.flatten()},{status:400});const {id}=await params;try{const data=parsed.data;const vehicle=await db.vehicle.update({where:{id},data:{...data,slug:slugify(`${data.title}-${data.stockNumber}`)}});return NextResponse.json(vehicle);}catch{return NextResponse.json({error:'Nie udało się zaktualizować pojazdu.'},{status:409});}}
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){if(!(await admin()))return NextResponse.json({error:'Brak uprawnień'},{status:403});const {id}=await params;try{await db.vehicle.delete({where:{id}});return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'Nie udało się usunąć pojazdu.'},{status:400});}}
