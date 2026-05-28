'use client'

import { useState, useEffect, useCallback } from 'react'
import { Communication } from '@/lib/types'
import { COMMUNICATION_TYPES } from '@/lib/constants'
import CommunicationList from '@/components/communications/CommunicationList'

export default function CommunicationsPage() {
  const [communications, setCommunications] = useState<Communication[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('')
  const [search, setSearch] = useState('')

  const fetchCommunications = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (typeFilter) params.set('type', typeFilter)
      if (search) params.set('search', search)
      const res = await fetch(`/api/communications?${params}`)
      const data = await res.json()
      setCommunications(data)
    } finally {
      setLoading(false)
    }
  }, [typeFilter, search])

  useEffect(() => {
    const timer = setTimeout(fetchCommunications, 300)
    return () => clearTimeout(timer)
  }, [fetchCommunications])

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Communications</h1>
          <p className="page-subtitle">Full activity log across all leads</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by lead name or summary..."
              className="form-input pl-9"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-select w-auto"
          >
            <option value="">All Types</option>
            {COMMUNICATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {(typeFilter || search) && (
            <button
              onClick={() => { setTypeFilter(''); setSearch('') }}
              className="btn-ghost text-xs text-red-500 hover:bg-red-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="card p-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-40" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : communications.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No communications found</p>
          </div>
        ) : (
          <CommunicationList communications={communications} showLead />
        )}
      </div>
    </div>
  )
}
