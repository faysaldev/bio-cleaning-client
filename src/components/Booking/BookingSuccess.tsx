import { ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";

interface BookingSuccessProps {
  reference: string;
}

export function BookingSuccess({ reference }: BookingSuccessProps) {
  return (
    <div className="flex min-h-[78vh] items-center justify-center bg-brand-cream/45 px-4 py-20">
      <div className="surface w-full max-w-lg p-6 text-center sm:p-9">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-brand-green/9 text-brand-green">
          <BadgeCheck className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold tracking-[-0.045em] text-brand-dark sm:text-4xl">Booking received</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">We&apos;ve received your request and will confirm the appointment as soon as the team reviews availability.</p>

        <div className="mt-6 rounded-xl border border-brand-green/18 bg-brand-cream/65 p-5">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Booking reference</div>
          <div className="mt-2 font-mono text-2xl font-bold tracking-[-0.03em] text-brand-dark">{reference}</div>
          <p className="mt-3 text-xs text-muted-foreground">Keep this reference for support or booking questions.</p>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Link href="/" className="btn-primary">Back home</Link>
          <Link href="/services" className="btn-secondary">View services <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </div>
  );
}
