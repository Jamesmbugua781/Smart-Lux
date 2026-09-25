interface PageHeaderProps {
  title: string
  subtitle: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">SMART LUX</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold text-[#0B1F3A] md:text-4xl">{title}</h1>
        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Demo data</span>
      </div>
      <p className="mt-2 max-w-2xl text-base text-slate-600">{subtitle}</p>
    </div>
  )
}
