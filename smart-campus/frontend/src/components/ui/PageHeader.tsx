interface PageHeaderProps {
  title: string
  subtitle: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#126B3A]">Smart Campus</p>
      <h1 className="mt-2 text-3xl font-semibold text-[#0B1F3A] md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-base text-slate-600">{subtitle}</p>
    </div>
  )
}
