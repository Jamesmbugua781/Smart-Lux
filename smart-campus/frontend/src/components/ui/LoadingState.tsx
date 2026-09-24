export function LoadingState() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#edf0f2] bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 3 }).map((_, index) => (
          <span
            key={index}
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#126B3A]"
            style={{ animationDelay: `${index * 120}ms` }}
          />
        ))}
      </div>
      <span className="text-sm text-slate-600">Loading campus information…</span>
    </div>
  )
}
