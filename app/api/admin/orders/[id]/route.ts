import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminForApi, unauthorizedAdminResponse } from "@/lib/auth/api-auth";
import { db } from "@/lib/db";
import { hasTrustedOrigin } from "@/lib/security";
const statusSchema=z.object({status:z.enum(["PENDING","PAID","PROCESSING","SHIPPED","DELIVERED","CANCELLED","REFUNDED"])});
export async function PATCH(request:NextRequest,{params}:{params:Promise<{id:string}>}){if(!hasTrustedOrigin(request))return NextResponse.json({message:"درخواست نامعتبر"},{status:403});const admin=await getAdminForApi();if(!admin)return unauthorizedAdminResponse();const parsed=statusSchema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({message:"وضعیت معتبر نیست"},{status:400});const {id}=await params;const before=await db.order.findUnique({where:{id},select:{status:true}});if(!before)return NextResponse.json({message:"سفارش پیدا نشد"},{status:404});await db.$transaction([db.order.update({where:{id},data:{status:parsed.data.status}}),db.auditLog.create({data:{actorId:admin.id,action:"ORDER_STATUS_CHANGED",entityType:"Order",entityId:id,metadata:{from:before.status,to:parsed.data.status}}})]);return NextResponse.json({ok:true})}
