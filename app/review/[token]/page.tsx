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
  const [done, setDone] = useState<{ redirectUrl?: string }>();
  const [error, setError] = useState("");

  const submit = async () => {
    if (!rating) { setError("Choose a rating from 1 to 5 stars."); return; }
    setError("");
    try { setDone(await submitReview({ token, rating, comment: comment.trim() || undefined }).unwrap()); }
    catch (e: any) { setError(e?.data?.message || "We could not submit this review."); }
  };

  return <div className="min-h-screen bg-brand-cream"><Navbar/><main className="container-page flex min-h-[70vh] items-center justify-center py-16 sm:py-24"><section className="w-full max-w-2xl rounded-2xl border border-border bg-white p-6 shadow-elevated sm:p-9">
    {isLoading ? <LoadingState label="Opening your review…" /> : isError || !data ? <ErrorState title="This review link is unavailable" description="It may have expired or already been replaced. Contact BIO Cleaning if you still want to share feedback." action={<Link href="/contact" className="btn-secondary">Contact us</Link>} /> : done || data.status === "SUBMITTED" ? <div className="py-8 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-brand-green"/><p className="mt-5 text-xs font-extrabold uppercase tracking-[.16em] text-brand-green">Thank you</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-brand-dark">Your feedback is recorded.</h1><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">We use your feedback to coach our team and improve future visits.</p>{done?.redirectUrl ? <a href={done.redirectUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">Share your experience publicly <ExternalLink className="h-4 w-4"/></a> : null}<div className="mt-4"><Link href="/portal" className="text-sm font-bold text-brand-green hover:underline">Open customer portal</Link></div></div> : <>
      <p className="text-xs font-extrabold uppercase tracking-[.16em] text-brand-green">Post-service review</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-brand-dark">How did we do, {data.customerName}?</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Your feedback is for booking <strong>{data.booking?.reference}</strong>{data.booking?.serviceType ? ` · ${data.booking.serviceType}` : ""}. Ratings are recorded internally first.</p>
      <div className="mt-7"><span className="field-label">Your rating</span><div className="mt-2 flex gap-2" role="radiogroup" aria-label="Rating out of five">{[1,2,3,4,5].map((value)=><button key={value} type="button" role="radio" aria-checked={rating===value} aria-label={`${value} star${value>1?"s":""}`} onClick={()=>setRating(value)} className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-white transition hover:-translate-y-0.5 hover:border-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"><Star className={`h-6 w-6 ${value<=rating?"fill-brand-lime text-brand-green":"text-muted-foreground/45"}`}/></button>)}</div></div>
      <label className="field-group mt-6"><span className="field-label">Anything you’d like us to know?</span><textarea className="field-control min-h-36 py-3" maxLength={5000} value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Tell us what went well or what we could improve."/><span className="text-right text-xs text-muted-foreground">{comment.length}/5000</span></label>
      {error ? <div className="feedback-panel mt-4 border-destructive/20 bg-destructive/5 text-destructive">{error}</div> : null}
      <button className="btn-primary mt-6 w-full justify-center" onClick={submit} disabled={submitting}>{submitting?<Loader2 className="h-4 w-4 animate-spin"/>:<Star className="h-4 w-4"/>}{submitting?"Submitting…":"Submit review"}</button>
      <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">If your rating meets the business’s configured threshold, we may offer an optional link where you can also share your experience publicly.</p>
    </>}
  </section></main><Footer/></div>;
}
