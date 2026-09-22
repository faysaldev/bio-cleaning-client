"use client";

import { CalendarClock, Repeat2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ErrorState, LoadingState } from "@/src/components/ui/feedback";
import { useGetAvailabilityMutation } from "@/src/redux/features/bookings/bookingsApi";
import { useCancelPortalBookingMutation, useGetPortalBookingsQuery, useLazyGetRebookDraftQuery, useReschedulePortalBookingMutation } from "@/src/redux/features/portal/portalApi";

const idOf=(b:any)=>String(b._id||b.id);
export default function PortalBookingsPage(){
  const router=useRouter();
  const {data,isLoading,isError,refetch}=useGetPortalBookingsQuery({limit:100});
  const [cancelBooking,{isLoading:cancelling}]=useCancelPortalBookingMutation();
  const [reschedule,{isLoading:rescheduling}]=useReschedulePortalBookingMutation();
  const [availability,{isLoading:loadingSlots}]=useGetAvailabilityMutation();
  const [getRebook]=useLazyGetRebookDraftQuery();
  const [activeId,setActiveId]=useState<string>();
  const [date,setDate]=useState(""); const [timeSlot,setTimeSlot]=useState(""); const [slots,setSlots]=useState<any[]>([]); const [message,setMessage]=useState("");
  if(isLoading)return <LoadingState label="Loading appointments…"/>;
  if(isError||!data)return <ErrorState action={<button className="btn-secondary" onClick={()=>refetch()}>Try again</button>}/>;
  const chooseDate=async(b:any,next:string)=>{setDate(next);setTimeSlot("");setSlots([]);if(!next||!b.serviceId)return;try{const result=await availability({serviceId:String(b.serviceId),property:b.property||{propertyType:"HOME"},propertySize:b.propertySize,frequency:b.frequency,extraCodes:(b.extras||[]).map((x:any)=>x.code),date:next}).unwrap();setSlots(result.slots||[]);}catch{setSlots([]);}};
  const doCancel=async(b:any)=>{if(!confirm(`Cancel booking ${b.reference}?`))return;setMessage("");try{await cancelBooking({id:idOf(b),reason:"Cancelled from customer portal"}).unwrap();setMessage("Booking cancelled.");}catch(e:any){setMessage(e?.data?.message||"Could not cancel this booking.");}};
  const doReschedule=async(b:any)=>{if(!date||!timeSlot)return;setMessage("");try{await reschedule({id:idOf(b),date,timeSlot}).unwrap();setActiveId(undefined);setDate("");setTimeSlot("");setMessage("Booking rescheduled successfully.");}catch(e:any){setMessage(e?.data?.message||"Could not reschedule this booking.");}};
  const bookAgain=async(b:any)=>{try{const draft=await getRebook(idOf(b)).unwrap();sessionStorage.setItem("bio-rebook-draft",JSON.stringify(draft));router.push("/book?rebook=1");}catch(e:any){setMessage(e?.data?.message||"Could not prepare this booking again.");}};
  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-green">
          Appointments
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark">
          Your Cleaning History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage upcoming visits or quickly book a previous service again.
        </p>
      </div>

      {message ? (
        <div className="rounded-2xl border border-brand-green/20 bg-[#F4FAF5] p-4 text-xs font-semibold text-brand-dark">
          {message}
        </div>
      ) : null}

      <div className="space-y-4">
        {data.items.map((b: any) => {
          const active =
            ["PENDING", "CONFIRMED"].includes(b.status) &&
            new Date(b.startAt || b.date).getTime() > Date.now();
          const open = activeId === idOf(b);

          return (
            <section
              key={idOf(b)}
              className="rounded-3xl border border-brand-green/12 bg-white shadow-sm overflow-hidden transition hover:border-brand-green/30"
            >
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg font-extrabold text-brand-dark">{b.serviceType}</h2>
                      <span className="inline-flex items-center rounded-full bg-brand-lime/20 border border-brand-lime/40 px-2.5 py-0.5 text-[11px] font-bold text-[#0C3629]">
                        {b.status}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {b.startAt ? new Date(b.startAt).toLocaleString() : `${b.date} · ${b.timeSlot}`} · Ref: <strong className="text-brand-dark">{b.reference}</strong>
                    </p>
                    {b.customerDetails?.address?.line1 ? (
                      <p className="mt-2 text-xs font-semibold text-brand-dark/80">
                        📍 {b.customerDetails?.address?.line1}, {b.customerDetails?.address?.city}
                      </p>
                    ) : null}
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-extrabold text-brand-dark">
                      ${Number(b.totalAmount || 0).toFixed(2)}
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {b.frequency.replaceAll("_", " ")}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-brand-green/8">
                  {active ? (
                    <>
                      <button
                        className="btn-secondary rounded-full px-4 text-xs font-bold"
                        onClick={() => {
                          setActiveId(open ? undefined : idOf(b));
                          setDate("");
                          setTimeSlot("");
                          setSlots([]);
                        }}
                      >
                        <CalendarClock className="h-3.5 w-3.5" />
                        Reschedule
                      </button>
                      <button
                        disabled={cancelling}
                        className="inline-flex items-center gap-1.5 rounded-full border border-destructive/20 bg-white px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 transition"
                        onClick={() => doCancel(b)}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                    </>
                  ) : null}
                  <button
                    className="btn-secondary rounded-full px-4 text-xs font-bold"
                    onClick={() => bookAgain(b)}
                  >
                    <Repeat2 className="h-3.5 w-3.5" />
                    Book again
                  </button>
                </div>
              </div>

              {open ? (
                <div className="border-t border-brand-green/12 bg-[#F4FAF5] p-6">
                  <h3 className="font-extrabold text-brand-dark text-sm">Choose a new appointment time</h3>
                  <div className="mt-3 grid gap-4 sm:grid-cols-[220px_1fr]">
                    <input
                      type="date"
                      className="field-control rounded-xl"
                      value={date}
                      onChange={(e) => chooseDate(b, e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2 items-center">
                      {loadingSlots ? (
                        <span className="text-xs text-muted-foreground">Checking available crew slots…</span>
                      ) : slots.length ? (
                        slots.map((s: any) => (
                          <button
                            key={s.time}
                            type="button"
                            onClick={() => setTimeSlot(s.time)}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                              timeSlot === s.time
                                ? "bg-[#0C3629] text-white shadow-sm ring-1 ring-brand-lime"
                                : "border border-brand-green/20 bg-white text-brand-dark hover:border-brand-green"
                            }`}
                          >
                            {s.label}
                          </button>
                        ))
                      ) : date ? (
                        <span className="text-xs text-muted-foreground">No available times on this date.</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Select a date to view available time slots.</span>
                      )}
                    </div>
                  </div>
                  <button
                    disabled={!timeSlot || rescheduling}
                    className="btn-primary mt-4 rounded-full px-6 text-xs font-bold"
                    onClick={() => doReschedule(b)}
                  >
                    {rescheduling ? "Rescheduling…" : "Confirm new time"}
                  </button>
                </div>
              ) : null}
            </section>
          );
        })}

        {!data.items.length ? (
          <div className="rounded-3xl border border-dashed border-brand-green/20 bg-white p-10 text-center text-sm text-muted-foreground">
            No bookings recorded yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
