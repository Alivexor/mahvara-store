import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function GET(){try{await db.$queryRaw`SELECT 1`;return NextResponse.json({status:"healthy",database:"connected"},{headers:{"Cache-Control":"no-store"}})}catch{return NextResponse.json({status:"degraded",database:"unavailable"},{status:503,headers:{"Cache-Control":"no-store"}})}}
