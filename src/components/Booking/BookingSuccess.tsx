import { BadgeCheck, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface BookingSuccessProps {
  reference: string;
}

export function BookingSuccess({ reference }: BookingSuccessProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <BadgeCheck className="w-12 h-12 text-brand-green" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-brand-yellow animate-bounce" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold text-brand-dark">
            Booking Received!
          </h1>
          <p className="text-muted-foreground">
            We&apos;ve received your request and will confirm your appointment
            within 2 hours.
          </p>
        </div>
        <div className="bg-brand-cream rounded-3xl p-8 border-2 border-brand-green/20 shadow-xl">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">
            Your Reference
          </div>
          <div className="text-3xl font-display font-bold text-brand-dark tracking-tighter">
            {reference}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            A confirmation email has been sent to your inbox.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link href="/" className="btn-primary flex-1">
            Back Home
          </Link>
          <Link href="/services" className="btn-secondary flex-1">
            View Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
