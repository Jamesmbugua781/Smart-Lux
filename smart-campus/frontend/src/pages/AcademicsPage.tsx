import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { PageHeader } from '../components/ui/PageHeader'
import { academicSections } from '../data/academics'

const academicTargets: Record<string, { label: string; to: string }> = {
  calendar: { label: 'Ask about calendar', to: '/chat?question=What%20is%20on%20the%20academic%20calendar%3F' },
  schools: { label: 'Find departments', to: '/campus?query=department' },
  courses: { label: 'Ask about courses', to: '/chat?question=How%20do%20I%20register%20for%20courses%3F' },
  examinations: { label: 'Ask about exams', to: '/chat?question=What%20should%20I%20know%20about%20examinations%3F' },
  registration: { label: 'Registration help', to: '/chat?question=How%20do%20I%20complete%20student%20registration%3F' },
}

export function AcademicsPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Navbar />

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="Academic Information"
            subtitle="Structured academic guidance for students, departments, and staff support."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {academicSections.map((section) => {
              const target = academicTargets[section.id]

              return (
                <article key={section.id} className="rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-[0_12px_30px_rgba(11,31,58,0.03)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">Academic</p>
                  <h2 className="mt-3 text-xl font-semibold text-[#0B1F3A]">{section.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">{section.subtitle}</p>
                  <ul className="mt-4 space-y-2">
                    {section.items.map((item) => (
                      <li key={item.label} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                        {item.externalUrl ? (
                          <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)]">
                            {item.label}
                          </a>
                        ) : (
                          <span>{item.label}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {target ? (
                    <Link to={target.to} className="action-link mt-5 text-sm">
                      {target.label}
                      <ArrowRight size={14} />
                    </Link>
                  ) : null}
                </article>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
