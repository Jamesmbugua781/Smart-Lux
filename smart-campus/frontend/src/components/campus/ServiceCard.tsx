import { ArrowRight, BookOpenText, Building2, FileText, GraduationCap, LibraryBig, Users, Wallet, Wifi } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ServiceCategory } from '../../types'

const iconMap = {
  'book-open': BookOpenText,
  'building-2': Building2,
  users: Users,
  library: LibraryBig,
  wifi: Wifi,
  wallet: Wallet,
  'file-text': FileText,
  'graduation-cap': GraduationCap,
} as const

const serviceTargets: Record<string, string> = {
  academics: '/academics',
  'campus-services': '/campus?query=services',
  'student-support': '/chat?question=What%20student%20support%20services%20are%20available%3F',
  library: '/campus?query=library',
  'ict-services': '/campus?query=ict',
  finance: '/chat?question=Where%20can%20I%20get%20tuition%20and%20finance%20support%3F',
  registry: '/campus?query=registry',
  departments: '/campus?query=department',
}

interface ServiceCardProps {
  category: ServiceCategory
}

export function ServiceCard({ category }: ServiceCardProps) {
  const Icon = iconMap[category.icon as keyof typeof iconMap] ?? BookOpenText
  const target = serviceTargets[category.id] ?? '/chat'

  return (
    <Link to={target} className="group block rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-[0_12px_30px_rgba(11,31,58,0.03)] transition duration-200 hover:-translate-y-1 hover:border-[#dfe7ee] hover:shadow-[0_18px_40px_rgba(11,31,58,0.06)]" aria-label={`Open ${category.title}`}>
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Icon size={18} />
        </div>
        <span className="text-[#0B1F3A] transition group-hover:translate-x-1">
          <ArrowRight size={17} />
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-[#0B1F3A]">{category.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
    </Link>
  )
}
