import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { slugify, vehicleSchema } from "@/lib/validation";
export async function POST(request:Request){const user=await getCurrentUser();if(!user||user.role!=="ADMIN")return NextResponse.json({error:"Brak uprawnień"},{status:403});const parsed=vehicleSchema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:"Sprawdź dane formularza",details:parsed.error.flatten()},{status:400});try{const data=parsed.data;const vehicle=await db.vehicle.create({data:{...data,slug:slugify(`${data.title}-${data.stockNumber}`)}});return NextResponse.json(vehicle,{status:201});}catch{return NextResponse.json({error:"Nie udało się zapisać. Sprawdź numer oferty."},{status:409});}}
