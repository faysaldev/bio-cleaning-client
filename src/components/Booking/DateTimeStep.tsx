import { BookedSlot } from "../../redux/features/bookings/types";

interface DateTimeStepProps {
  date: string;
  time: string;
  frequency: string;
  bookedSlots: BookedSlot[];
  onUpdate: (data: Record<string, string>) => void;
}

export function DateTimeStep({ date, time, frequency, bookedSlots, onUpdate }: DateTimeStepProps) {
  const times = ["Morning 8-12", "Afternoon 12-5", "Evening 5-8"];
  const frequencies = ["One-time", "Weekly", "Bi-weekly", "Monthly"];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-green">Step 2</p>
        <h2 className="mt-1 text-2xl font-bold text-brand-dark">Choose date & time</h2>
        <p className="mt-1 text-sm text-muted-foreground">Booked time windows are disabled automatically.</p>
      </div>

      <div>
        <label htmlFor="booking-date" className="field-label">Date</label>
        <input id="booking-date" type="date" value={date || ""} className="field-control" onChange={(event) => onUpdate({ date: event.target.value })} />
      </div>

      <fieldset>
        <legend className="field-label">Time slot</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {times.map((slot) => {
            const booked = bookedSlots.includes(slot);
            const selected = time === slot;
            return (
              <button
                key={slot}
                type="button"
                disabled={booked}
                aria-pressed={selected}
                onClick={() => onUpdate({ time: slot })}
                className={`min-h-12 rounded-xl border px-3 py-2 text-sm font-bold transition ${selected ? "border-brand-green bg-brand-green/6 text-brand-dark" : booked ? "cursor-not-allowed border-border bg-muted/60 text-muted-foreground/45" : "border-border bg-white text-brand-dark hover:border-brand-green/40 hover:bg-brand-cream/35"}`}
              >
                {slot}
                {booked ? <span className="mt-0.5 block text-[9px] font-extrabold uppercase tracking-[0.1em]">Booked</span> : null}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="field-label">Frequency</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {frequencies.map((item) => (
            <button key={item} type="button" aria-pressed={frequency === item} onClick={() => onUpdate({ frequency: item })} className={`min-h-11 rounded-xl border px-3 text-sm font-bold transition ${frequency === item ? "border-brand-green bg-brand-green/6 text-brand-dark" : "border-border bg-white text-muted-foreground hover:border-brand-green/40 hover:text-brand-dark"}`}>
              {item}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
