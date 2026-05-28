import { format, isToday, isYesterday } from 'date-fns'
import { Communication } from '@/lib/types'
import { COMMUNICATION_TYPES } from '@/lib/constants'

interface CommunicationListProps {
  communications: Communication[]
  showLead?: boolean
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  CALL: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  TEXT: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  EMAIL: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  MEETING: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  TOUR: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  OTHER: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
}

const TYPE_COLORS: Record<string, string> = {
  CALL: 'bg-blue-100 text-blue-600',
  TEXT: 'bg-green-100 text-green-600',
  EMAIL: 'bg-indigo-100 text-indigo-600',
  MEETING: 'bg-purple-100 text-purple-600',
  TOUR: 'bg-teal-100 text-teal-600',
  OTHER: 'bg-slate-100 text-slate-600',
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`
  if (isYesterday(date)) return `Yesterday, ${format(date, 'h:mm a')}`
  return format(date, 'MMM d, yyyy')
}

export default function CommunicationList({ communications, showLead = false }: CommunicationListProps) {
  if (communications.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <svg className="w-10 h-10 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-sm">No communications yet</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-slate-100" />

      <div className="space-y-4">
        {communications.map((comm) => {
          const typeConfig = COMMUNICATION_TYPES.find((t) => t.value === comm.type)
          const iconColor = TYPE_COLORS[comm.type] || TYPE_COLORS.OTHER
          const icon = TYPE_ICONS[comm.type] || TYPE_ICONS.OTHER
          const isOverdue = comm.followUpDate && new Date(comm.followUpDate) < new Date()

          return (
            <div key={comm.id} className="relative flex gap-4">
              {/* Icon */}
              <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconColor} border-2 border-white shadow-sm`}>
                {icon}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-slate-900 text-sm">
                      {typeConfig?.label || comm.type}
                    </span>
                    {showLead && comm.lead && (
                      <span className="ml-2 text-xs text-slate-500">
                        — {comm.lead.firstName} {comm.lead.lastName}
                      </span>
                    )}
                  </div>
                  <time className="text-xs text-slate-400 flex-shrink-0 mt-0.5">
                    {formatDate(comm.date)}
                  </time>
                </div>

                <p className="text-sm text-slate-700 mt-1 leading-relaxed">{comm.summary}</p>

                {comm.nextStep && (
                  <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                    <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span><strong className="text-slate-700">Next:</strong> {comm.nextStep}</span>
                  </div>
                )}

                {comm.followUpDate && (
                  <div className={`mt-2 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${
                    isOverdue ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'
                  }`}>
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {isOverdue ? 'Overdue follow-up: ' : 'Follow up: '}
                      {format(new Date(comm.followUpDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
