import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth/session";
import { hasTrustedOrigin } from "@/lib/security";
export async function POST(request: NextRequest) { if (!hasTrustedOrigin(request)) return NextResponse.json({ message: "درخواست نامعتبر" }, { status: 403 }); await deleteSession(); return NextResponse.json({ ok: true }); }
