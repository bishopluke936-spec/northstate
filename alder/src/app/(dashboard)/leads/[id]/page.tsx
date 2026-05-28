'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Lead } from '@/lib/types'
import { CARE_LEVELS, URGENCY_LEVELS, REFERRAL_STATUSES } from '@/lib/constants'
import LeadStatusBadge from '@/components/leads/LeadStatusBadge'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import CommunicationForm from '@/components/communications/CommunicationForm'
import CommunicationList from '@/components/communications/CommunicationList'
import ReferralForm from '@/components/referrals/ReferralForm'

type TabKey = 'overview' | 'care' | 'family' | 'referrals' | 'communications'

export default function LeadDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [showCommModal, setShowCommModal] = useState(false)
  const [showReferralModal, setShowReferralModal] = useState(false)

  const fetchLead = useCallback(async () => {
    try {
      const res = await fetch(`/api/leads/${id}`)
      const data = await res.json()
      setLead(data)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchLead()
  }, [fetchLead])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card p-6 animate-pulse">
          <div className="h-8 bg-slate-100 rounded w-48 mb-3" />
          <div className="h-4 bg-slate-100 rounded w-64" />
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-700">Lead not found</h2>
        <Link href="/leads" className="btn-primary mt-4 inline-flex">Back to Leads</Link>
      </div>
    )
  }

  const urgency = URGENCY_LEVELS.find((u) => u.value === lead.urgencyLevel)
  const careLevelLabels = lead.careLevel
    ? lead.careLevel
        .split(',')
        .map((cl) => CARE_LEVELS.find((c) => c.value === cl.trim())?.label || cl.trim())
    : []

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'care', label: 'Care Assessment' },
    { key: 'family', label: 'Family', count: lead.familyContacts?.length },
    { key: 'referrals', label: 'Referrals', count: lead.referrals?.length },
    { key: 'communications', label: 'Communications', count: lead.communications?.length },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/leads" className="hover:text-teal-600 transition-colors">Leads</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-900 font-medium">{lead.firstName} {lead.lastName}</span>
      </nav>

      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
              {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {lead.firstName} {lead.lastName}
                {lead.age && <span className="text-slate-400 text-lg font-normal ml-2">age {lead.age}</span>}
              </h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <LeadStatusBadge status={lead.status} />
                {urgency && <Badge color={urgency.color}>{urgency.label} Urgency</Badge>}
                {lead.timeline && (
                  <span className="text-sm text-slate-500">Timeline: {lead.timeline}</span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 flex-wrap">
                {lead.phone && (
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-teal-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {lead.phone}
                  </a>
                )}
                {lead.email && (
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-teal-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {lead.email}
                  </a>
                )}
                {lead.currentCity && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {lead.currentCity}
                    {lead.preferredLocation && ` → ${lead.preferredLocation}`}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowCommModal(true)}
              className="btn-secondary text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Log Contact
            </button>
            <Link href={`/leads/${lead.id}/edit`} className="btn-secondary text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === tab.key
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                activeTab === tab.key ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Financial Details</h3>
            <div className="space-y-2">
              {lead.budgetMin && lead.budgetMax && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Budget Range</span>
                  <span className="font-medium text-slate-900">
                    ${lead.budgetMin.toLocaleString()} – ${lead.budgetMax.toLocaleString()}/mo
                  </span>
                </div>
              )}
              {lead.timeline && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Timeline</span>
                  <span className="font-medium text-slate-900">{lead.timeline}</span>
                </div>
              )}
            </div>
          </div>

          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Assignment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned To</span>
                <span className="font-medium text-slate-900">
                  {lead.assignedTo?.name || 'Unassigned'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Created</span>
                <span className="font-medium text-slate-900">
                  {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Updated</span>
                <span className="font-medium text-slate-900">
                  {format(new Date(lead.updatedAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>

          {lead.notes && (
            <div className="card p-5 md:col-span-2">
              <h3 className="font-semibold text-slate-900 mb-2">Notes</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{lead.notes}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'care' && (
        <div className="card p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Care Levels Needed</h3>
            {careLevelLabels.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {careLevelLabels.map((label) => (
                  <span key={label} className="bg-teal-50 text-teal-800 text-sm px-3 py-1.5 rounded-lg font-medium border border-teal-200">
                    {label}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No care levels specified</p>
            )}
          </div>

          {lead.mobility && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Mobility</h3>
              <p className="text-sm text-slate-700">{lead.mobility}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Clinical Flags</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Medication Support', value: lead.medicationSupport },
                { label: 'Memory / Dementia', value: lead.memoryDementia },
                { label: 'Fall Risk', value: lead.fallRisk },
                { label: 'Behavioral Concerns', value: lead.behavioralConcerns },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className={`p-3 rounded-xl border text-center ${
                    value
                      ? 'bg-orange-50 border-orange-200 text-orange-800'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="text-lg mb-1">{value ? '⚠' : '✓'}</div>
                  <p className="text-xs font-medium leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'family' && (
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Family Contacts</h3>
          {lead.familyContacts && lead.familyContacts.length > 0 ? (
            <div className="space-y-3">
              {lead.familyContacts.map((contact) => (
                <div key={contact.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-900">{contact.name}</h4>
                        {contact.isPrimary && (
                          <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{contact.relationship}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="flex items-center gap-1 hover:text-teal-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {contact.phone}
                      </a>
                    )}
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-teal-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {contact.email}
                      </a>
                    )}
                    {contact.preferredContact && (
                      <span className="text-slate-400">Prefers: {contact.preferredContact}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-8">No family contacts added yet.</p>
          )}
        </div>
      )}

      {activeTab === 'referrals' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Referrals</h3>
            <button onClick={() => setShowReferralModal(true)} className="btn-primary text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Referral
            </button>
          </div>
          {lead.referrals && lead.referrals.length > 0 ? (
            <div className="space-y-3">
              {lead.referrals.map((referral) => {
                const statusConfig = REFERRAL_STATUSES.find((s) => s.value === referral.status)
                return (
                  <div key={referral.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">{referral.community?.name}</h4>
                          {statusConfig && <Badge color={statusConfig.color}>{statusConfig.label}</Badge>}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {referral.community?.city}, {referral.community?.state}
                        </p>
                      </div>
                      {referral.referralFeeAmount && (
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">
                            ${referral.referralFeeAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-400">{referral.referralFeeStatus}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                      <span>Referred: {format(new Date(referral.referralDate), 'MMM d, yyyy')}</span>
                      {referral.tourDate && (
                        <span>Tour: {format(new Date(referral.tourDate), 'MMM d, yyyy')}</span>
                      )}
                      {referral.moveInDate && (
                        <span>Move-In: {format(new Date(referral.moveInDate), 'MMM d, yyyy')}</span>
                      )}
                    </div>
                    {referral.notes && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{referral.notes}</p>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">No referrals yet.</p>
              <button onClick={() => setShowReferralModal(true)} className="btn-primary mt-3 text-sm">
                Create First Referral
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'communications' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Communications</h3>
            <button onClick={() => setShowCommModal(true)} className="btn-primary text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Log Contact
            </button>
          </div>
          <CommunicationList communications={lead.communications || []} />
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={showCommModal}
        onClose={() => setShowCommModal(false)}
        title="Log Communication"
        size="lg"
      >
        <CommunicationForm
          leadId={lead.id}
          onSuccess={() => {
            setShowCommModal(false)
            fetchLead()
            setActiveTab('communications')
          }}
          onCancel={() => setShowCommModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        title="Create Referral"
        size="lg"
      >
        <ReferralForm
          leadId={lead.id}
          onSuccess={() => {
            setShowReferralModal(false)
            fetchLead()
            setActiveTab('referrals')
          }}
          onCancel={() => setShowReferralModal(false)}
        />
      </Modal>
    </div>
  )
}
