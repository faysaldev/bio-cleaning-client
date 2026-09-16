import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export function LoadingState({
  label = "Loading…",
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground" role="status" aria-live="polite">
        <Loader2 className="h-4 w-4 animate-spin text-brand-green" aria-hidden="true" />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div className="surface grid min-h-64 place-items-center p-8" role="status" aria-live="polite">
      <div className="text-center">
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-brand-cream text-brand-green">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        </div>
        <p className="mt-3 text-sm font-semibold text-brand-dark">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">This should only take a moment.</p>
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className = "",
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`surface grid min-h-56 place-items-center p-8 text-center ${className}`}>
      <div className="max-w-md">
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-border bg-brand-cream/70 text-brand-green">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-brand-dark">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn’t load this information. Please try again.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="surface grid min-h-56 place-items-center border-destructive/20 p-8 text-center" role="alert">
      <div className="max-w-md">
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-destructive/8 text-destructive">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-brand-dark">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="table-shell overflow-hidden" role="status" aria-label="Loading table data">
      <div className="grid gap-px bg-border" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <div key={`head-${index}`} className="bg-brand-cream/80 p-4">
            <div className="skeleton h-3 w-2/3 rounded-md" />
          </div>
        ))}
        {Array.from({ length: rows * columns }).map((_, index) => (
          <div key={`cell-${index}`} className="bg-white p-4">
            <div className="skeleton h-4 w-4/5 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
