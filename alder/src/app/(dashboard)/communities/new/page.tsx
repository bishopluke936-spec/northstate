'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { CARE_LEVELS, REFERRAL_FEE_TYPES } from '@/lib/constants'

export default function NewCommunityPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: 'CA',
    zip: '',
    contactPerson: '',
    phone: '',
    email: '',
    website: '',
    careLevels: [] as string[],
    pricingMin: '',
    pricingMax: '',
    availability: '',
    referralAgreement: false,
    referralFeeType: 'FLAT',
    referralFeeAmount: '',
    notes: '',
  })

  const update = (field: string, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleCareLevel = (value: string) => {
    setForm((prev) => ({
      ...prev,
      careLevels: prev.careLevels.includes(value)
        ? prev.careLevels.filter((v) => v !== value)
        : [...prev.careLevels, value],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) {
      toast.error('Community name is required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          careLevels: form.careLevels.join(','),
          pricingMin: form.pricingMin ? parseFloat(form.pricingMin) : null,
          pricingMax: form.pricingMax ? parseFloat(form.pricingMax) : null,
          referralFeeAmount: form.referralFeeAmount ? parseFloat(form.referralFeeAmount) : null,
        }),
      })

      if (!res.ok) throw new Error('Failed to create community')
      const data = await res.json()
      toast.success('Community added!')
      router.push(`/communities/${data.id}`)
    } catch {
      toast.error('Failed to create community')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/communities" className="hover:text-teal-600">Communities</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-900 font-medium">New Community</span>
      </nav>

      <div>
        <h1 className="page-title">Add Community</h1>
        <p className="page-subtitle">Add a new senior living community to your network</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">Basic Information</h2>
          <Input
            label="Community Name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
            placeholder="Chico Gardens Assisted Living"
          />
          <Input
            label="Street Address"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            placeholder="123 Main St"
          />
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="City"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="Chico"
              />
            </div>
            <Input
              label="State"
              value={form.state}
              onChange={(e) => update('state', e.target.value)}
              placeholder="CA"
            />
          </div>
          <Input
            label="ZIP Code"
            value={form.zip}
            onChange={(e) => update('zip', e.target.value)}
            placeholder="95926"
          />
        </div>

        {/* Contact Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Person"
              value={form.contactPerson}
              onChange={(e) => update('contactPerson', e.target.value)}
              placeholder="Linda Pearson"
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="(530) 891-4400"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="admissions@community.com"
            />
            <Input
              label="Website"
              value={form.website}
              onChange={(e) => update('website', e.target.value)}
              placeholder="https://community.com"
            />
          </div>
        </div>

        {/* Care Levels */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">Care Levels Offered</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CARE_LEVELS.map((level) => (
              <label
                key={level.value}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                  form.careLevels.includes(level.value)
                    ? 'border-teal-400 bg-teal-50 text-teal-800'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.careLevels.includes(level.value)}
                  onChange={() => toggleCareLevel(level.value)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium">{level.label}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Input
              label="Min Price ($/mo)"
              type="number"
              value={form.pricingMin}
              onChange={(e) => update('pricingMin', e.target.value)}
              placeholder="3000"
            />
            <Input
              label="Max Price ($/mo)"
              type="number"
              value={form.pricingMax}
              onChange={(e) => update('pricingMax', e.target.value)}
              placeholder="6000"
            />
            <Select
              label="Availability"
              value={form.availability}
              onChange={(e) => update('availability', e.target.value)}
              options={[
                { value: 'Good', label: 'Good' },
                { value: 'Limited', label: 'Limited' },
                { value: 'Full', label: 'Full / Waitlist' },
              ]}
              placeholder="Select availability"
            />
          </div>
        </div>

        {/* Referral Agreement */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Referral Agreement</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.referralAgreement}
                onChange={(e) => update('referralAgreement', e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span className="text-sm text-slate-700 font-medium">Has Agreement</span>
            </label>
          </div>
          {form.referralAgreement && (
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Fee Type"
                value={form.referralFeeType}
                onChange={(e) => update('referralFeeType', e.target.value)}
                options={REFERRAL_FEE_TYPES}
              />
              <Input
                label={form.referralFeeType === 'FLAT' ? 'Fee Amount ($)' : 'Fee Percentage (%)'}
                type="number"
                value={form.referralFeeAmount}
                onChange={(e) => update('referralFeeAmount', e.target.value)}
                placeholder={form.referralFeeType === 'FLAT' ? '2000' : '75'}
              />
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="card p-6">
          <label className="form-label">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            className="form-textarea"
            rows={4}
            placeholder="Notes about this community, relationship, key contacts..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add Community
          </Button>
        </div>
      </form>
    </div>
  )
}
