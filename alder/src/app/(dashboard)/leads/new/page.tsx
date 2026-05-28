import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LeadForm from '@/components/leads/LeadForm'

export default async function NewLeadPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true, password: false },
    orderBy: { name: 'asc' },
  })

  const safeUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
    password: '',
  }))

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/leads" className="hover:text-teal-600 transition-colors">Leads</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-900 font-medium">New Lead</span>
      </nav>

      <div>
        <h1 className="page-title">Add New Lead</h1>
        <p className="page-subtitle">Complete the assessment to add a new senior to your pipeline</p>
      </div>

      <div className="card p-6">
        <LeadForm users={safeUsers} />
      </div>
    </div>
  )
}
