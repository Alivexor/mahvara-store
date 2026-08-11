import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hasTrustedOrigin, rateLimit, requestFingerprint } from "@/lib/security";
const schema=z.object({email:z.email().transform(value=>value.toLowerCase().trim())});
export async function POST(request:NextRequest){if(!hasTrustedOrigin(request))return NextResponse.json({message:"درخواست نامعتبر"},{status:403});if(!rateLimit(`newsletter:${requestFingerprint(request)}`,5,60*60_000).allowed)return NextResponse.json({message:"درخواست بیش از حد"},{status:429});const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({message:"ایمیل معتبر نیست"},{status:400});try{await db.newsletterSubscriber.upsert({where:{email:parsed.data.email},create:{email:parsed.data.email},update:{isActive:true}});return NextResponse.json({ok:true})}catch{return NextResponse.json({message:"سرویس موقتاً در دسترس نیست"},{status:503})}}
