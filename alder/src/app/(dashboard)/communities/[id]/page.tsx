'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { Community } from '@/lib/types'
import { CARE_LEVELS, REFERRAL_STATUSES } from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function CommunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [community, setCommunity] = useState<Community | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCommunity = useCallback(async () => {
    try {
      const res = await fetch(`/api/communities/${id}`)
      const data = await res.json()
      setCommunity(data)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCommunity()
  }, [fetchCommunity])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this community? This cannot be undone.')) return

    try {
      const res = await fetch(`/api/communities/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Community deleted')
      router.push('/communities')
    } catch {
      toast.error('Failed to delete community')
    }
  }

  if (loading) {
    return (
      <div className="card p-6 animate-pulse max-w-4xl mx-auto">
        <div className="h-8 bg-slate-100 rounded w-48 mb-3" />
        <div className="h-4 bg-slate-100 rounded w-32" />
      </div>
    )
  }

  if (!community) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-700">Community not found</h2>
        <Link href="/communities" className="btn-primary mt-4 inline-flex">Back to Communities</Link>
      </div>
    )
  }

  const careLevelList = community.careLevels
    ? community.careLevels.split(',').map((c) => c.trim())
    : []

  const getCareLevelLabel = (value: string) =>
    CARE_LEVELS.find((c) => c.value === value)?.label || value

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/communities" className="hover:text-teal-600">Communities</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-900 font-medium">{community.name}</span>
      </nav>

      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{community.name}</h1>
              {community.city && (
                <p className="text-slate-500 mt-1">
                  {community.address && `${community.address}, `}
                  {community.city}, {community.state} {community.zip}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {careLevelList.map((level) => (
                  <Badge key={level} color="indigo" size="sm">
                    {getCareLevelLabel(level)}
                  </Badge>
                ))}
                {community.referralAgreement && (
                  <Badge color="green" size="sm">Referral Agreement</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Contact */}
        <div className="card p-5 space-y-3">
          <h3 className="font-semibold text-slate-900">Contact Information</h3>
          <div className="space-y-2 text-sm">
            {community.contactPerson && (
              <div className="flex items-center gap-2 text-slate-700">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {community.contactPerson}
              </div>
            )}
            {community.phone && (
              <a href={`tel:${community.phone}`} className="flex items-center gap-2 text-slate-700 hover:text-teal-600">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {community.phone}
              </a>
            )}
            {community.email && (
              <a href={`mailto:${community.email}`} className="flex items-center gap-2 text-slate-700 hover:text-teal-600">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {community.email}
              </a>
            )}
            {community.website && (
              <a href={community.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-700 hover:text-teal-600">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Visit Website
              </a>
            )}
          </div>
        </div>

        {/* Pricing & Referral */}
        <div className="card p-5 space-y-3">
          <h3 className="font-semibold text-slate-900">Pricing & Referral</h3>
          <div className="space-y-2 text-sm">
            {community.pricingMin && community.pricingMax && (
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Pricing</span>
                <span className="font-medium text-slate-900">
                  ${community.pricingMin.toLocaleString()} – ${community.pricingMax.toLocaleString()}
                </span>
              </div>
            )}
            {community.availability && (
              <div className="flex justify-between">
                <span className="text-slate-500">Availability</span>
                <Badge
                  color={community.availability === 'Good' ? 'green' : community.availability === 'Limited' ? 'yellow' : 'red'}
                  size="sm"
                >
                  {community.availability}
                </Badge>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Referral Agreement</span>
              <span className={`font-medium ${community.referralAgreement ? 'text-green-600' : 'text-slate-400'}`}>
                {community.referralAgreement ? 'Yes' : 'No'}
              </span>
            </div>
            {community.referralAgreement && community.referralFeeAmount && (
              <div className="flex justify-between">
                <span className="text-slate-500">Referral Fee</span>
                <span className="font-medium text-slate-900">
                  {community.referralFeeType === 'FLAT'
                    ? `$${community.referralFeeAmount.toLocaleString()}`
                    : `${community.referralFeeAmount}%`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {community.notes && (
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 mb-2">Notes</h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{community.notes}</p>
        </div>
      )}

      {/* Referral History */}
      {community.referrals && community.referrals.length > 0 && (
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Referral History</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="table-header">Lead</th>
                <th className="table-header">Date</th>
                <th className="table-header">Status</th>
                <th className="table-header">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {community.referrals.map((ref) => {
                const statusConfig = REFERRAL_STATUSES.find((s) => s.value === ref.status)
                return (
                  <tr key={ref.id} className="hover:bg-slate-50">
                    <td className="table-cell">
                      {ref.lead ? (
                        <Link href={`/leads/${ref.lead.id}`} className="text-teal-600 hover:text-teal-700 font-medium">
                          {ref.lead.firstName} {ref.lead.lastName}
                        </Link>
                      ) : '—'}
                    </td>
                    <td className="table-cell">{format(new Date(ref.referralDate), 'MMM d, yyyy')}</td>
                    <td className="table-cell">
                      {statusConfig && <Badge color={statusConfig.color} size="sm">{statusConfig.label}</Badge>}
                    </td>
                    <td className="table-cell">
                      {ref.referralFeeAmount ? `$${ref.referralFeeAmount.toLocaleString()}` : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
