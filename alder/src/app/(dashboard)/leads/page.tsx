'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Lead } from '@/lib/types'
import { LEAD_STATUSES, CARE_LEVELS, URGENCY_LEVELS } from '@/lib/constants'
import LeadCard from '@/components/leads/LeadCard'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [careLevelFilter, setCareLevelFilter] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('')

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      if (careLevelFilter) params.set('careLevel', careLevelFilter)
      if (urgencyFilter) params.set('urgency', urgencyFilter)

      const res = await fetch(`/api/leads?${params}`)
      const data = await res.json()
      setLeads(data)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, careLevelFilter, urgencyFilter])

  useEffect(() => {
    const timer = setTimeout(fetchLeads, 300)
    return () => clearTimeout(timer)
  }, [fetchLeads])

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setCareLevelFilter('')
    setUrgencyFilter('')
  }

  const hasFilters = search || statusFilter || careLevelFilter || urgencyFilter

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">{leads.length} {leads.length === 1 ? 'lead' : 'leads'}</p>
        </div>
        <Link href="/leads/new" className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Lead
        </Link>
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
              placeholder="Search by name, city, phone..."
              className="form-input pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select w-auto text-sm"
            >
              <option value="">All Statuses</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <select
              value={careLevelFilter}
              onChange={(e) => setCareLevelFilter(e.target.value)}
              className="form-select w-auto text-sm"
            >
              <option value="">All Care Levels</option>
              {CARE_LEVELS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="form-select w-auto text-sm"
            >
              <option value="">All Urgencies</option>
              {URGENCY_LEVELS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="btn-ghost text-xs py-1.5 px-3 text-red-500 hover:bg-red-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lead List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-5 bg-slate-100 rounded w-40" />
                <div className="h-5 bg-slate-100 rounded w-20" />
              </div>
              <div className="h-4 bg-slate-100 rounded w-64 mt-2" />
            </div>
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-slate-600 font-medium">No leads found</h3>
          <p className="text-slate-400 text-sm mt-1">
            {hasFilters ? 'Try adjusting your filters' : 'Get started by adding your first lead'}
          </p>
          {!hasFilters && (
            <Link href="/leads/new" className="btn-primary mt-4 inline-flex">
              Add First Lead
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  )
}
