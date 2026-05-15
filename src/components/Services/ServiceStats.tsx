interface ServiceStatsProps {
  stats: [string, string][];
}

export function ServiceStats({ stats }: ServiceStatsProps) {
  return (
    <div className="container-page mb-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(([value, label]) => (
          <div
            key={label}
            className="group rounded-3xl border border-border bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="font-display text-4xl font-bold text-brand-dark group-hover:text-brand-green transition-colors">
              {value}
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mt-1">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
