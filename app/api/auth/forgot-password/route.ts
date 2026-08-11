import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hasTrustedOrigin, rateLimit, requestFingerprint } from "@/lib/security";
const schema=z.object({email:z.email().transform(v=>v.toLowerCase().trim())});
export async function POST(request:NextRequest){const generic="اگر حسابی با این ایمیل وجود داشته باشد، درخواست بازیابی ثبت می‌شود.";if(!hasTrustedOrigin(request))return NextResponse.json({message:"درخواست نامعتبر است."},{status:403});if(!rateLimit(`reset:${requestFingerprint(request)}`,3,30*60_000).allowed)return NextResponse.json({message:"کمی بعد دوباره تلاش کنید."},{status:429});const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({message:"ایمیل معتبر وارد کنید."},{status:400});const user=await db.user.findUnique({where:{email:parsed.data.email}}).catch(()=>null);if(user){const token=randomBytes(32).toString("base64url");await db.passwordResetToken.create({data:{userId:user.id,tokenHash:createHash("sha256").update(token).digest("hex"),expiresAt:new Date(Date.now()+30*60_000)}});/* Email adapter intentionally receives the raw token only after owner configures a provider. Never log it. */}return NextResponse.json({message:generic})}
