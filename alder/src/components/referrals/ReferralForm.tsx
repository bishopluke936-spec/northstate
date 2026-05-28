'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Community } from '@/lib/types'
import { REFERRAL_STATUSES } from '@/lib/constants'
import { format } from 'date-fns'

interface ReferralFormProps {
  leadId: string
  onSuccess: () => void
  onCancel: () => void
}

export default function ReferralForm({ leadId, onSuccess, onCancel }: ReferralFormProps) {
  const [loading, setLoading] = useState(false)
  const [communities, setCommunities] = useState<Community[]>([])
  const [form, setForm] = useState({
    communityId: '',
    referralDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'SENT',
    tourDate: '',
    followUpDate: '',
    referralFeeStatus: 'PENDING',
    referralFeeAmount: '',
    notes: '',
  })

  useEffect(() => {
    fetch('/api/communities')
      .then((r) => r.json())
      .then((data) => setCommunities(data))
      .catch(() => toast.error('Failed to load communities'))
  }, [])

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const selectedCommunity = communities.find((c) => c.id === form.communityId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.communityId) {
      toast.error('Please select a community')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/leads/${leadId}/referrals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tourDate: form.tourDate || null,
          followUpDate: form.followUpDate || null,
          referralFeeAmount: form.referralFeeAmount ? parseFloat(form.referralFeeAmount) : null,
        }),
      })

      if (!res.ok) throw new Error('Failed to create referral')
      toast.success('Referral created!')
      onSuccess()
    } catch {
      toast.error('Failed to create referral')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Community"
        value={form.communityId}
        onChange={(e) => update('communityId', e.target.value)}
        options={communities.map((c) => ({
          value: c.id,
          label: `${c.name} — ${c.city}, ${c.state}`,
        }))}
        placeholder="Select a community..."
        required
      />

      {selectedCommunity && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-sm">
          <p className="font-medium text-teal-800">{selectedCommunity.name}</p>
          <p className="text-teal-600 mt-0.5">
            Contact: {selectedCommunity.contactPerson || 'N/A'} · {selectedCommunity.phone || ''}
          </p>
          {selectedCommunity.pricingMin && selectedCommunity.pricingMax && (
            <p className="text-teal-600">
              Pricing: ${selectedCommunity.pricingMin.toLocaleString()}–${selectedCommunity.pricingMax.toLocaleString()}/mo
            </p>
          )}
          {selectedCommunity.referralAgreement && (
            <p className="text-teal-700 font-medium mt-1">
              Referral fee: {selectedCommunity.referralFeeType === 'FLAT'
                ? `$${selectedCommunity.referralFeeAmount?.toLocaleString()}`
                : `${selectedCommunity.referralFeeAmount}%`}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Referral Date"
          type="date"
          value={form.referralDate}
          onChange={(e) => update('referralDate', e.target.value)}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => update('status', e.target.value)}
          options={REFERRAL_STATUSES}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Tour Date"
          type="date"
          value={form.tourDate}
          onChange={(e) => update('tourDate', e.target.value)}
        />
        <Input
          label="Follow-Up Date"
          type="date"
          value={form.followUpDate}
          onChange={(e) => update('followUpDate', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Fee Status"
          value={form.referralFeeStatus}
          onChange={(e) => update('referralFeeStatus', e.target.value)}
          options={[
            { value: 'PENDING', label: 'Pending' },
            { value: 'INVOICED', label: 'Invoiced' },
            { value: 'PAID', label: 'Paid' },
            { value: 'WAIVED', label: 'Waived' },
          ]}
        />
        <Input
          label="Fee Amount ($)"
          type="number"
          value={form.referralFeeAmount}
          onChange={(e) => update('referralFeeAmount', e.target.value)}
          placeholder={selectedCommunity?.referralFeeAmount?.toString() || ''}
        />
      </div>

      <div>
        <label className="form-label">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          className="form-textarea"
          rows={3}
          placeholder="Any notes about this referral..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Create Referral
        </Button>
      </div>
    </form>
  )
}
