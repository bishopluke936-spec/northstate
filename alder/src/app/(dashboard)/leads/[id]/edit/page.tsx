import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import LeadForm from '@/components/leads/LeadForm'
import { Lead, User } from '@/lib/types'

interface Props {
  params: { id: string }
}

export default async function EditLeadPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      assignedTo: true,
      familyContacts: true,
    },
  })

  if (!lead) notFound()

  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
  })

  const safeLead = {
    ...lead,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
    familyContacts: lead.familyContacts.map((fc) => ({
      ...fc,
      createdAt: fc.createdAt.toISOString(),
      updatedAt: fc.updatedAt.toISOString(),
    })),
    assignedTo: lead.assignedTo
      ? {
          ...lead.assignedTo,
          createdAt: lead.assignedTo.createdAt.toISOString(),
          updatedAt: lead.assignedTo.updatedAt.toISOString(),
        }
      : null,
  }

  const safeUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    password: '',
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  }))

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/leads" className="hover:text-teal-600 transition-colors">Leads</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href={`/leads/${lead.id}`} className="hover:text-teal-600 transition-colors">
          {lead.firstName} {lead.lastName}
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-900 font-medium">Edit</span>
      </nav>

      <div>
        <h1 className="page-title">Edit Lead</h1>
        <p className="page-subtitle">Updating: {lead.firstName} {lead.lastName}</p>
      </div>

      <div className="card p-6">
        <LeadForm lead={safeLead as Lead} users={safeUsers as User[]} isEdit />
      </div>
    </div>
  )
}
