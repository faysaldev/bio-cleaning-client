"use client";

import { CheckCircle2, ExternalLink, Loader2, Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Footer } from "@/src/components/Footer";
import { Navbar } from "@/src/components/Navbar";
import { ErrorState, LoadingState } from "@/src/components/ui/feedback";
import { useGetPublicReviewQuery, useSubmitPublicReviewMutation } from "@/src/redux/features/communications/communicationsApi";

export default function ReviewPage() {
  const params = useParams<{ token: string }>();
  const token = String(params?.token || "");
  const { data, isLoading, isError } = useGetPublicReviewQuery(token, { skip: !token });
  const [submitReview, { isLoading: submitting }] = useSubmitPublicReviewMutation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [publishConsent, setPublishConsent] = useState(false);
  const [done, setDone] = useState<{ redirectUrl?: string }>();
  const [error, setError] = useState("");

  const submit = async () => {
    if (!rating) { setError("Choose a rating from 1 to 5 stars."); return; }
    setError("");
    try { setDone(await submitReview({ token, rating, comment: comment.trim() || undefined, publishConsent }).unwrap()); }
    catch (e: any) { setError(e?.data?.message || "We could not submit this review."); }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col justify-between">
      <Navbar />
      <main className="container-page flex min-h-[70vh] items-center justify-center py-16 sm:py-24">
        <section className="w-full max-w-xl rounded-3xl border border-brand-green/15 bg-white p-7 sm:p-10 shadow-xl">
          {isLoading ? (
            <LoadingState label="Opening your review…" />
          ) : isError || !data ? (
            <ErrorState
              title="This review link is unavailable"
              description="It may have expired or already been submitted. Contact BIO Cleaning if you still want to share feedback."
              action={
                <Link href="/contact" className="btn-secondary rounded-full">
                  Contact us
                </Link>
              }
            />
          ) : done || data.status === "SUBMITTED" ? (
            <div className="py-8 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#0C3629] text-brand-lime shadow-md">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-green">
                Feedback Recorded
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark">
                Thank you for your review!
              </h1>
              <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-muted-foreground">
                We use your input to coach our cleaning technicians, refine our equipment checklists, and continually improve every visit.
              </p>
              {done?.redirectUrl ? (
                <div className="mt-6">
                  <a
                    href={done.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-xs font-extrabold shadow-md"
                  >
                    Share your experience on Google <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ) : null}
              <div className="mt-5">
                <Link href="/portal" className="text-xs font-extrabold text-brand-green hover:underline">
                  Go to Customer Portal →
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-green">
                Post-Service Review
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark">
                How did we do, {data.customerName}?
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Your feedback is for booking <strong className="text-brand-dark">{data.booking?.reference}</strong>
                {data.booking?.serviceType ? ` (${data.booking.serviceType})` : ""}.
              </p>

              {/* Star Rating Selector */}
              <div className="mt-7">
                <span className="field-label text-xs font-bold text-brand-dark">Your Overall Rating</span>
                <div className="mt-2.5 flex gap-2.5" role="radiogroup" aria-label="Rating out of five">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={rating === value}
                      aria-label={`${value} star${value > 1 ? "s" : ""}`}
                      onClick={() => setRating(value)}
                      className={`grid h-12 w-12 place-items-center rounded-2xl border transition-all ${
                        value <= rating
                          ? "border-brand-lime bg-[#0C3629] shadow-md ring-2 ring-brand-lime/40"
                          : "border-brand-green/15 bg-[#F7FAF8] hover:border-brand-green hover:bg-white"
                      }`}
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          value <= rating ? "fill-brand-lime text-brand-lime" : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments Textarea */}
              <label className="field-group mt-6">
                <span className="field-label text-xs font-bold text-brand-dark">
                  Anything specific you’d like us to know?
                </span>
                <textarea
                  className="field-control rounded-2xl min-h-32 py-3"
                  maxLength={5000}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what went well, which room was your favorite, or anything we can polish next time…"
                />
                <span className="text-right text-[11px] text-muted-foreground mt-1">
                  {comment.length} / 5000 characters
                </span>
              </label>

              {/* Permission Checkbox */}
              <label className="mt-4 flex items-start gap-3 rounded-2xl border border-brand-green/15 bg-[#F4FAF5] p-4 text-xs text-foreground/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishConsent}
                  onChange={(e) => setPublishConsent(e.target.checked)}
                  disabled={!comment.trim()}
                  className="mt-0.5 h-4 w-4 accent-brand-green rounded"
                />
                <span>
                  <strong className="text-brand-dark">Public testimonial permission.</strong> BIO Cleaning may feature this written review on its website using my first name and city only. (Optional).
                </span>
              </label>

              {error ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-3.5 text-xs font-semibold text-destructive mt-4">
                  {error}
                </div>
              ) : null}

              <button
                className="btn-primary mt-6 w-full rounded-full py-3.5 text-xs font-extrabold shadow-md justify-center"
                onClick={submit}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Star className="h-4 w-4" />
                )}
                {submitting ? "Submitting Review…" : "Submit Review"}
              </button>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
                All submissions are encrypted and reviewed by our quality management team.
              </p>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
