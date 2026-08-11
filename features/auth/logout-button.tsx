"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
export function LogoutButton() { const router = useRouter(); return <button type="button" className="btn-ghost w-full justify-start text-red-700" onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); router.refresh(); }}><LogOut size={18} /> خروج از حساب</button>; }
