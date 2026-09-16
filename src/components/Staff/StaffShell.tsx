"use client";

import { ReactNode, useEffect } from "react";
import { BriefcaseBusiness, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGetSessionQuery, useLogoutSessionMutation } from "@/src/redux/features/auth/authApi";
import { clearSession, selectCurrentUser, setSession } from "@/src/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { LoadingState } from "@/src/components/ui/feedback";

export function StaffShell({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch(); const router = useRouter(); const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser); const isLogin = pathname === "/staff/login"; const { data, isLoading, isFetching, isError } = useGetSessionQuery(undefined, { skip: isLogin });
  const [logout] = useLogoutSessionMutation();
  useEffect(()=>{
    if(data?.user){ if(data.user.role!=="cleaner"){ router.replace(data.user.role==="user"?"/":"/admin"); return; } dispatch(setSession(data)); return; }
    if(!isLoading&&!isFetching&&isError){ dispatch(clearSession()); router.replace("/staff/login"); }
  },[data,isLoading,isFetching,isError,dispatch,router]);
  if (isLogin) return <>{children}</>;
  if(isLoading||isFetching||!user||user.role!=="cleaner") return <main className="min-h-screen bg-brand-cream p-5"><div className="mx-auto max-w-lg pt-[28vh]"><LoadingState label="Opening your field workspace…"/></div></main>;
  const signOut=async()=>{try{await logout().unwrap();}catch{}finally{dispatch(clearSession());router.replace("/staff/login");}};
  return <div className="min-h-screen bg-[linear-gradient(180deg,var(--brand-cream),var(--background)_28rem)] pb-24 text-foreground">
    <header className="sticky top-0 z-30 border-b border-border bg-white/92 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4"><div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-dark text-brand-lime"><BriefcaseBusiness className="h-4 w-4"/></div><div className="min-w-0 flex-1"><div className="truncate text-sm font-extrabold text-brand-dark">BIO Cleaning Field</div><div className="truncate text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">{user.name}</div></div><button onClick={signOut} className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-white text-muted-foreground" aria-label="Sign out"><LogOut className="h-4 w-4"/></button></div></header>
    <main className="mx-auto max-w-5xl px-4 py-5 sm:py-7">{children}</main>
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/96 px-4 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl"><div className="mx-auto grid max-w-md grid-cols-2 gap-2"><Link href="/staff" className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-extrabold ${pathname==="/staff"||pathname.startsWith("/staff/jobs")?"bg-brand-dark text-white":"text-muted-foreground"}`}><BriefcaseBusiness className="h-4 w-4"/>My jobs</Link><Link href="/staff/profile" className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-extrabold ${pathname.startsWith("/staff/profile")?"bg-brand-dark text-white":"text-muted-foreground"}`}><UserRound className="h-4 w-4"/>Profile</Link></div></nav>
  </div>;
}
