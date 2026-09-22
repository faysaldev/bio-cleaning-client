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
            className="group rounded-3xl border border-brand-green/12 bg-white p-6 shadow-sm hover:border-brand-lime/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-dark group-hover:text-brand-green transition-colors">
              {value}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-extrabold mt-1.5">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
