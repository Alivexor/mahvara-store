import { requireUser } from "@/lib/auth/session";
import { LogoutButton } from "@/features/auth/logout-button";
import { AccountNavigation } from "@/features/account/account-navigation";
export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) { const user = await requireUser(); return <div className="container-shell grid gap-7 py-10 lg:grid-cols-[17rem_1fr]"><aside className="surface-card h-fit p-4"><div className="border-b border-black/5 p-3"><p className="font-black">{user.firstName} {user.lastName}</p><p className="mt-1 truncate text-xs text-muted" dir="ltr">{user.email}</p></div><AccountNavigation /><div className="mt-3 border-t border-black/5 pt-3"><LogoutButton /></div></aside><main className="min-w-0">{children}</main></div>; }
