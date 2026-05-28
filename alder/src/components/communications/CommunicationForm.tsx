'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { COMMUNICATION_TYPES } from '@/lib/constants'
import { format } from 'date-fns'

interface CommunicationFormProps {
  leadId: string
  onSuccess: () => void
  onCancel: () => void
}

export default function CommunicationForm({ leadId, onSuccess, onCancel }: CommunicationFormProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    type: 'CALL',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    summary: '',
    nextStep: '',
    followUpDate: '',
    followUpReminder: false,
  })

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.summary.trim()) {
      toast.error('Summary is required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/leads/${leadId}/communications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          followUpDate: form.followUpDate || null,
        }),
      })

      if (!res.ok) throw new Error('Failed to log communication')
      toast.success('Communication logged!')
      onSuccess()
    } catch {
      toast.error('Failed to log communication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Type"
          value={form.type}
          onChange={(e) => update('type', e.target.value)}
          options={COMMUNICATION_TYPES}
        />
        <Input
          label="Date & Time"
          type="datetime-local"
          value={form.date}
          onChange={(e) => update('date', e.target.value)}
        />
      </div>

      <div>
        <label className="form-label">
          Summary <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.summary}
          onChange={(e) => update('summary', e.target.value)}
          className="form-textarea"
          rows={4}
          placeholder="Describe what was discussed..."
          required
        />
      </div>

      <div>
        <label className="form-label">Next Step</label>
        <textarea
          value={form.nextStep}
          onChange={(e) => update('nextStep', e.target.value)}
          className="form-textarea"
          rows={2}
          placeholder="What needs to happen next?"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Follow-Up Date"
          type="date"
          value={form.followUpDate}
          onChange={(e) => update('followUpDate', e.target.value)}
        />
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.followUpReminder}
              onChange={(e) => update('followUpReminder', e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">Set reminder</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Log Communication
        </Button>
      </div>
    </form>
  )
}
