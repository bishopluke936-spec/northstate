import Link from 'next/link'
import { format } from 'date-fns'
import { Lead } from '@/lib/types'
import { URGENCY_LEVELS, CARE_LEVELS } from '@/lib/constants'
import LeadStatusBadge from './LeadStatusBadge'
import Badge from '@/components/ui/Badge'

interface LeadCardProps {
  lead: Lead
}

export default function LeadCard({ lead }: LeadCardProps) {
  const urgency = URGENCY_LEVELS.find((u) => u.value === lead.urgencyLevel)
  const careLevelLabels = lead.careLevel
    ? lead.careLevel
        .split(',')
        .map((cl) => CARE_LEVELS.find((c) => c.value === cl.trim())?.label || cl.trim())
        .slice(0, 2)
    : []

  const lastComm = lead.communications?.[0]

  return (
    <Link href={`/leads/${lead.id}`}>
      <div className="card p-4 hover:shadow-md hover:border-teal-200 transition-all cursor-pointer group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                {lead.firstName} {lead.lastName}
              </h3>
              {lead.age && (
                <span className="text-slate-400 text-sm">age {lead.age}</span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <LeadStatusBadge status={lead.status} size="sm" />
              {urgency && (
                <Badge color={urgency.color} size="sm">
                  {urgency.label} Urgency
                </Badge>
              )}
              {careLevelLabels.map((label) => (
                <Badge key={label} color="gray" size="sm">
                  {label}
                </Badge>
              ))}
            </div>

            <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
              {lead.currentCity && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {lead.currentCity}
                </span>
              )}
              {lead.budgetMin && lead.budgetMax && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ${lead.budgetMin.toLocaleString()}–${lead.budgetMax.toLocaleString()}/mo
                </span>
              )}
              {lastComm && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {format(new Date(lastComm.date), 'MMM d')}
                </span>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            {lead.assignedTo && (
              <div className="flex items-center gap-1.5 justify-end">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                  {lead.assignedTo.name.charAt(0)}
                </div>
                <span className="text-xs text-slate-500 hidden sm:block">
                  {lead.assignedTo.name.split(' ')[0]}
                </span>
              </div>
            )}
            <div className="mt-1">
              <svg className="w-4 h-4 text-slate-300 group-hover:text-teal-400 transition-colors ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
