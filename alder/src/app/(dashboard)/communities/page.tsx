'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Community } from '@/lib/types'
import { CARE_LEVELS } from '@/lib/constants'
import Badge from '@/components/ui/Badge'

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [careLevelFilter, setCareLevelFilter] = useState('')

  const fetchCommunities = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (careLevelFilter) params.set('careLevel', careLevelFilter)
      const res = await fetch(`/api/communities?${params}`)
      const data = await res.json()
      setCommunities(data)
    } finally {
      setLoading(false)
    }
  }, [search, careLevelFilter])

  useEffect(() => {
    const timer = setTimeout(fetchCommunities, 300)
    return () => clearTimeout(timer)
  }, [fetchCommunities])

  const getCareLevelLabel = (value: string) =>
    CARE_LEVELS.find((c) => c.value === value)?.label || value

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Communities</h1>
          <p className="page-subtitle">{communities.length} partner communities</p>
        </div>
        <Link href="/communities/new" className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Community
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
              placeholder="Search by name or city..."
              className="form-input pl-9"
            />
          </div>
          <select
            value={careLevelFilter}
            onChange={(e) => setCareLevelFilter(e.target.value)}
            className="form-select w-auto"
          >
            <option value="">All Care Levels</option>
            {CARE_LEVELS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Communities Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-5 bg-slate-100 rounded w-3/4 mb-3" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : communities.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-slate-600 font-medium">No communities found</h3>
          <p className="text-slate-400 text-sm mt-1">Add your first community partner</p>
          <Link href="/communities/new" className="btn-primary mt-4 inline-flex">
            Add Community
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((community) => {
            const careLevelList = community.careLevels
              ? community.careLevels.split(',').map((c) => c.trim())
              : []

            return (
              <Link key={community.id} href={`/communities/${community.id}`}>
                <div className="card p-5 hover:shadow-md hover:border-teal-200 transition-all cursor-pointer group h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    {community.referralAgreement && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        Agreement
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors leading-tight">
                    {community.name}
                  </h3>
                  {community.city && (
                    <p className="text-sm text-slate-500 mt-1">
                      {community.city}, {community.state} {community.zip}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 mt-3">
                    {careLevelList.slice(0, 3).map((level) => (
                      <span key={level} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {getCareLevelLabel(level)}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-3 flex items-center justify-between text-sm border-t border-slate-100">
                    {community.pricingMin && community.pricingMax ? (
                      <span className="text-slate-500">
                        ${community.pricingMin.toLocaleString()}–${community.pricingMax.toLocaleString()}/mo
                      </span>
                    ) : (
                      <span className="text-slate-300">No pricing info</span>
                    )}
                    {community.availability && (
                      <Badge
                        color={community.availability === 'Good' ? 'green' : community.availability === 'Limited' ? 'yellow' : 'red'}
                        size="sm"
                      >
                        {community.availability}
                      </Badge>
                    )}
                  </div>

                  {community.contactPerson && (
                    <p className="text-xs text-slate-400 mt-2">Contact: {community.contactPerson}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
