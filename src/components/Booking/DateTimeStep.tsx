import { BookedSlot } from "../../redux/features/bookings/types";

interface DateTimeStepProps {
  date: string;
  time: string;
  frequency: string;
  bookedSlots: BookedSlot[];
  onUpdate: (data: any) => void;
}

export function DateTimeStep({
  date,
  time,
  frequency,
  bookedSlots,
  onUpdate,
}: DateTimeStepProps) {
  const times = ["Morning 8-12", "Afternoon 12-5", "Evening 5-8"];
  const frequencies = ["One-time", "Weekly", "Bi-weekly", "Monthly"];

  return (
    <div className="space-y-5">
      <h2 className="text-2xl text-brand-dark mb-2">Choose date & time</h2>
      <label className="block">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Date
        </span>
        <input
          type="date"
          value={date || ""}
          className="mt-2 w-full p-3 rounded-xl border border-border bg-white"
          onChange={(e) => onUpdate({ date: e.target.value })}
        />
      </label>
      <div>
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Time slot
        </span>
        <div className="grid sm:grid-cols-3 gap-2 mt-2">
          {times.map((t) => {
            const isBooked = bookedSlots.includes(t);
            return (
              <button
                key={t}
                disabled={isBooked}
                onClick={() => onUpdate({ time: t })}
                className={`p-3 rounded-xl border-2 text-sm transition-all ${
                  time === t
                    ? "border-brand-green bg-brand-green/5"
                    : isBooked
                      ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                      : "border-border hover:border-brand-green/50"
                }`}
              >
                {t}
                {isBooked && (
                  <span className="block text-[10px] uppercase font-bold text-gray-400 mt-0.5">
                    Booked
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Frequency
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
          {frequencies.map((f) => (
            <button
              key={f}
              onClick={() => onUpdate({ frequency: f })}
              className={`p-3 rounded-xl border-2 text-sm ${
                frequency === f
                  ? "border-brand-green bg-brand-green/5"
                  : "border-border"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
