import { NextResponse } from "next/server";
import { getCurrentUser } from "./session";
export async function getAdminForApi(){const user=await getCurrentUser().catch(()=>null);return user?.role==="ADMIN"?user:null}
export const unauthorizedAdminResponse=()=>NextResponse.json({message:"دسترسی مدیر لازم است."},{status:403});
