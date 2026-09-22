"use client";

import { ReactNode, useEffect } from "react";
import { BriefcaseBusiness, LogOut, UserRound, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useGetSessionQuery,
  useLogoutSessionMutation,
} from "@/src/redux/features/auth/authApi";
import {
  clearSession,
  selectCurrentUser,
  setSession,
} from "@/src/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { LoadingState } from "@/src/components/ui/feedback";

export function StaffShell({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const isLogin = pathname === "/staff/login";
  const { data, isLoading, isFetching, isError } = useGetSessionQuery(undefined, {
    skip: isLogin,
  });
  const [logout] = useLogoutSessionMutation();

  useEffect(() => {
    if (data?.user) {
      if (data.user.role !== "cleaner") {
        router.replace(data.user.role === "user" ? "/" : "/admin");
        return;
      }
      dispatch(setSession(data));
      return;
    }
    if (!isLoading && !isFetching && isError) {
      dispatch(clearSession());
      router.replace("/staff/login");
    }
  }, [data, isLoading, isFetching, isError, dispatch, router]);

  if (isLogin) return <>{children}</>;

  if (isLoading || isFetching || !user || user.role !== "cleaner") {
    return (
      <main className="min-h-screen bg-[#F4FAF5] p-5">
        <div className="mx-auto max-w-lg pt-[28vh]">
          <LoadingState label="Opening your field workspace…" />
        </div>
      </main>
    );
  }

  const signOut = async () => {
    try {
      await logout().unwrap();
    } catch {
    } finally {
      dispatch(clearSession());
      router.replace("/staff/login");
    }
  };

  const isJobsActive = pathname === "/staff" || pathname.startsWith("/staff/jobs");
  const isProfileActive = pathname.startsWith("/staff/profile");

  return (
    <div className="min-h-screen bg-[#F4FAF5] pb-28 text-foreground">
      {/* Top Spruce Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0C3629]/95 backdrop-blur-xl text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-lime text-brand-dark shadow-sm">
              <BriefcaseBusiness className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-extrabold tracking-tight text-white">
                  BIO Cleaning Field
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-brand-lime/15 border border-brand-lime/30 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-lime">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-lime animate-pulse" />
                  On Duty
                </span>
              </div>
              <div className="truncate text-xs font-medium text-white/60">
                {user.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white/90 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
              aria-label="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Field Workspace */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>

      {/* Mobile-First Floating Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-4 z-40 px-4 pointer-events-none">
        <div className="mx-auto max-w-md pointer-events-auto rounded-full border border-white/20 bg-[#0C3629]/95 p-1.5 shadow-2xl backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-1.5">
            <Link
              href="/staff"
              className={`flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-extrabold transition-all ${
                isJobsActive
                  ? "bg-brand-lime text-brand-dark shadow-md scale-[1.02]"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <BriefcaseBusiness className="h-4 w-4" />
              <span>Today&apos;s Jobs</span>
            </Link>

            <Link
              href="/staff/profile"
              className={`flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-extrabold transition-all ${
                isProfileActive
                  ? "bg-brand-lime text-brand-dark shadow-md scale-[1.02]"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <UserRound className="h-4 w-4" />
              <span>My Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
