'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Referral } from '@/lib/types'
import { REFERRAL_STATUSES, REFERRAL_FEE_STATUSES } from '@/lib/constants'
import Badge from '@/components/ui/Badge'

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [feeFilter, setFeeFilter] = useState('')

  const fetchReferrals = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      if (feeFilter) params.set('feeStatus', feeFilter)
      const res = await fetch(`/api/referrals?${params}`)
      const data = await res.json()
      setReferrals(data)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, feeFilter])

  useEffect(() => {
    fetchReferrals()
  }, [fetchReferrals])

  const totalRevenue = referrals
    .filter((r) => r.referralFeeStatus === 'PAID' || r.referralFeeStatus === 'INVOICED')
    .reduce((sum, r) => sum + (r.referralFeeAmount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Referrals</h1>
          <p className="page-subtitle">{referrals.length} referrals • Est. {`$${totalRevenue.toLocaleString()}`} pipeline</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select w-auto"
          >
            <option value="">All Statuses</option>
            {REFERRAL_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={feeFilter}
            onChange={(e) => setFeeFilter(e.target.value)}
            className="form-select w-auto"
          >
            <option value="">All Fee Statuses</option>
            {REFERRAL_FEE_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          {(statusFilter || feeFilter) && (
            <button
              onClick={() => { setStatusFilter(''); setFeeFilter('') }}
              className="btn-ghost text-xs text-red-500 hover:bg-red-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="card p-6 animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded" />
          ))}
        </div>
      ) : referrals.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <h3 className="text-slate-600 font-medium">No referrals found</h3>
          <p className="text-slate-400 text-sm mt-1">Referrals are created from lead detail pages</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="table-header">Lead</th>
                  <th className="table-header">Community</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Tour</th>
                  <th className="table-header">Move-In</th>
                  <th className="table-header">Fee</th>
                  <th className="table-header">Fee Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {referrals.map((referral) => {
                  const statusConfig = REFERRAL_STATUSES.find((s) => s.value === referral.status)
                  const feeStatus = REFERRAL_FEE_STATUSES.find((f) => f.value === referral.referralFeeStatus)
                  return (
                    <tr key={referral.id} className="hover:bg-slate-50 transition-colors">
                      <td className="table-cell">
                        {referral.lead ? (
                          <Link href={`/leads/${referral.lead.id}`} className="text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap">
                            {referral.lead.firstName} {referral.lead.lastName}
                          </Link>
                        ) : '—'}
                      </td>
                      <td className="table-cell">
                        {referral.community ? (
                          <Link href={`/communities/${referral.community.id}`} className="text-slate-700 hover:text-teal-600">
                            <div>{referral.community.name}</div>
                            <div className="text-xs text-slate-400">{referral.community.city}, {referral.community.state}</div>
                          </Link>
                        ) : '—'}
                      </td>
                      <td className="table-cell whitespace-nowrap">
                        {format(new Date(referral.referralDate), 'MMM d, yyyy')}
                      </td>
                      <td className="table-cell">
                        {statusConfig && <Badge color={statusConfig.color} size="sm">{statusConfig.label}</Badge>}
                      </td>
                      <td className="table-cell whitespace-nowrap text-slate-500">
                        {referral.tourDate ? format(new Date(referral.tourDate), 'MMM d') : '—'}
                      </td>
                      <td className="table-cell whitespace-nowrap text-slate-500">
                        {referral.moveInDate ? format(new Date(referral.moveInDate), 'MMM d') : '—'}
                      </td>
                      <td className="table-cell font-medium">
                        {referral.referralFeeAmount ? `$${referral.referralFeeAmount.toLocaleString()}` : '—'}
                      </td>
                      <td className="table-cell">
                        {feeStatus && (
                          <Badge
                            color={referral.referralFeeStatus === 'PAID' ? 'green' : referral.referralFeeStatus === 'INVOICED' ? 'yellow' : 'gray'}
                            size="sm"
                          >
                            {feeStatus.label}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
