'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import {
  LEAD_STATUSES,
  CARE_LEVELS,
  URGENCY_LEVELS,
  MOBILITY_OPTIONS,
  TIMELINE_OPTIONS,
} from '@/lib/constants'
import { Lead, User } from '@/lib/types'

interface LeadFormProps {
  lead?: Lead
  users: User[]
  isEdit?: boolean
}

type TabKey = 'basic' | 'care' | 'family'

export default function LeadForm({ lead, users, isEdit = false }: LeadFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>('basic')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    firstName: lead?.firstName || '',
    lastName: lead?.lastName || '',
    age: lead?.age?.toString() || '',
    phone: lead?.phone || '',
    email: lead?.email || '',
    currentCity: lead?.currentCity || '',
    preferredLocation: lead?.preferredLocation || '',
    budgetMin: lead?.budgetMin?.toString() || '',
    budgetMax: lead?.budgetMax?.toString() || '',
    timeline: lead?.timeline || '',
    status: lead?.status || 'NEW_LEAD',
    urgencyLevel: lead?.urgencyLevel || 'MEDIUM',
    notes: lead?.notes || '',
    assignedToId: lead?.assignedToId || '',
    // Care
    careLevel: lead?.careLevel ? lead.careLevel.split(',') : [] as string[],
    mobility: lead?.mobility || '',
    medicationSupport: lead?.medicationSupport || false,
    memoryDementia: lead?.memoryDementia || false,
    fallRisk: lead?.fallRisk || false,
    behavioralConcerns: lead?.behavioralConcerns || false,
  })

  const [familyContacts, setFamilyContacts] = useState(
    lead?.familyContacts || []
  )
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    preferredContact: 'PHONE',
    isPrimary: false,
  })

  const update = (field: string, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleCareLevel = (value: string) => {
    setForm((prev) => ({
      ...prev,
      careLevel: prev.careLevel.includes(value)
        ? prev.careLevel.filter((v) => v !== value)
        : [...prev.careLevel, value],
    }))
  }

  const addContact = () => {
    if (!newContact.name || !newContact.relationship) {
      toast.error('Name and relationship are required')
      return
    }
    setFamilyContacts((prev) => [
      ...prev,
      { ...newContact, id: `temp-${Date.now()}`, leadId: lead?.id || '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ])
    setNewContact({ name: '', relationship: '', phone: '', email: '', preferredContact: 'PHONE', isPrimary: false })
  }

  const removeContact = (id: string) => {
    setFamilyContacts((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName || !form.lastName) {
      toast.error('First and last name are required')
      setActiveTab('basic')
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...form,
        age: form.age ? parseInt(form.age) : null,
        budgetMin: form.budgetMin ? parseFloat(form.budgetMin) : null,
        budgetMax: form.budgetMax ? parseFloat(form.budgetMax) : null,
        careLevel: form.careLevel.join(','),
        assignedToId: form.assignedToId || null,
        familyContacts: familyContacts
          .filter((c) => c.id.startsWith('temp-'))
          .map(({ id: _id, leadId: _leadId, createdAt: _c, updatedAt: _u, ...rest }) => rest),
      }

      const url = isEdit ? `/api/leads/${lead!.id}` : '/api/leads'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save lead')
      }

      const saved = await res.json()
      toast.success(isEdit ? 'Lead updated!' : 'Lead created!')
      router.push(`/leads/${saved.id}`)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'care', label: 'Care Assessment' },
    { key: 'family', label: 'Family Contacts' },
  ]

  return (
    <form onSubmit={handleSubmit}>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-slate-100 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.key
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              required
              placeholder="Dorothy"
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              required
              placeholder="Hargrove"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Age"
              type="number"
              value={form.age}
              onChange={(e) => update('age', e.target.value)}
              placeholder="82"
              min="18"
              max="115"
            />
            <Input
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="(530) 555-1234"
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="resident@email.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current City"
              value={form.currentCity}
              onChange={(e) => update('currentCity', e.target.value)}
              placeholder="Chico"
            />
            <Input
              label="Preferred Location"
              value={form.preferredLocation}
              onChange={(e) => update('preferredLocation', e.target.value)}
              placeholder="Chico or Redding"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Budget Min ($/mo)"
              type="number"
              value={form.budgetMin}
              onChange={(e) => update('budgetMin', e.target.value)}
              placeholder="3000"
            />
            <Input
              label="Budget Max ($/mo)"
              type="number"
              value={form.budgetMax}
              onChange={(e) => update('budgetMax', e.target.value)}
              placeholder="5000"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              options={LEAD_STATUSES}
            />
            <Select
              label="Urgency Level"
              value={form.urgencyLevel}
              onChange={(e) => update('urgencyLevel', e.target.value)}
              options={URGENCY_LEVELS}
            />
            <Select
              label="Timeline"
              value={form.timeline}
              onChange={(e) => update('timeline', e.target.value)}
              options={TIMELINE_OPTIONS}
              placeholder="Select timeline"
            />
          </div>

          <Select
            label="Assigned To"
            value={form.assignedToId}
            onChange={(e) => update('assignedToId', e.target.value)}
            options={users.map((u) => ({ value: u.id, label: u.name }))}
            placeholder="Unassigned"
          />

          <div>
            <label className="form-label">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              className="form-textarea"
              rows={4}
              placeholder="Add any relevant notes about this lead..."
            />
          </div>
        </div>
      )}

      {/* Care Assessment Tab */}
      {activeTab === 'care' && (
        <div className="space-y-6">
          <div>
            <label className="form-label mb-3 block">Care Level Needed</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CARE_LEVELS.map((level) => (
                <label
                  key={level.value}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                    form.careLevel.includes(level.value)
                      ? 'border-teal-400 bg-teal-50 text-teal-800'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.careLevel.includes(level.value)}
                    onChange={() => toggleCareLevel(level.value)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium">{level.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Select
            label="Mobility"
            value={form.mobility}
            onChange={(e) => update('mobility', e.target.value)}
            options={MOBILITY_OPTIONS}
            placeholder="Select mobility level"
          />

          <div>
            <label className="form-label mb-3 block">Clinical Flags</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { field: 'medicationSupport', label: 'Medication Support Needed' },
                { field: 'memoryDementia', label: 'Memory / Dementia Issues' },
                { field: 'fallRisk', label: 'Fall Risk' },
                { field: 'behavioralConcerns', label: 'Behavioral Concerns' },
              ].map(({ field, label }) => (
                <label
                  key={field}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    form[field as keyof typeof form]
                      ? 'border-orange-400 bg-orange-50 text-orange-800'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form[field as keyof typeof form] as boolean}
                    onChange={(e) => update(field, e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded border-slate-300"
                  />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Family Contacts Tab */}
      {activeTab === 'family' && (
        <div className="space-y-6">
          {familyContacts.length > 0 && (
            <div className="space-y-3">
              {familyContacts.map((contact) => (
                <div key={contact.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{contact.name}</p>
                      {contact.isPrimary && (
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">{contact.relationship}</p>
                    <div className="flex gap-3 mt-1 text-xs text-slate-500">
                      {contact.phone && <span>{contact.phone}</span>}
                      {contact.email && <span>{contact.email}</span>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeContact(contact.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border border-dashed border-slate-300 rounded-xl p-5 space-y-4">
            <h4 className="font-medium text-slate-800">Add Family Contact</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Name"
                value={newContact.name}
                onChange={(e) => setNewContact((p) => ({ ...p, name: e.target.value }))}
                placeholder="Carol Johnson"
              />
              <Select
                label="Relationship"
                value={newContact.relationship}
                onChange={(e) => setNewContact((p) => ({ ...p, relationship: e.target.value }))}
                options={[
                  { value: 'Spouse', label: 'Spouse / Partner' },
                  { value: 'Son', label: 'Son' },
                  { value: 'Daughter', label: 'Daughter' },
                  { value: 'Sibling', label: 'Sibling' },
                  { value: 'Friend', label: 'Friend' },
                  { value: 'POA', label: 'Power of Attorney' },
                  { value: 'Guardian', label: 'Legal Guardian' },
                  { value: 'Other', label: 'Other' },
                ]}
                placeholder="Select relationship"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone"
                value={newContact.phone}
                onChange={(e) => setNewContact((p) => ({ ...p, phone: e.target.value }))}
                placeholder="(530) 555-1234"
              />
              <Input
                label="Email"
                value={newContact.email}
                onChange={(e) => setNewContact((p) => ({ ...p, email: e.target.value }))}
                placeholder="contact@email.com"
              />
            </div>
            <div className="flex items-center gap-4">
              <Select
                label="Preferred Contact Method"
                value={newContact.preferredContact}
                onChange={(e) => setNewContact((p) => ({ ...p, preferredContact: e.target.value }))}
                options={[
                  { value: 'PHONE', label: 'Phone' },
                  { value: 'EMAIL', label: 'Email' },
                  { value: 'TEXT', label: 'Text' },
                ]}
              />
              <label className="flex items-center gap-2 mt-5 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={newContact.isPrimary}
                  onChange={(e) => setNewContact((p) => ({ ...p, isPrimary: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm text-slate-700">Primary Contact</span>
              </label>
            </div>
            <Button type="button" variant="secondary" onClick={addContact}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Contact
            </Button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
        <div className="flex gap-2">
          {activeTab !== 'basic' && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActiveTab(activeTab === 'family' ? 'care' : 'basic')}
            >
              Back
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          {activeTab !== 'family' ? (
            <Button
              type="button"
              onClick={() => setActiveTab(activeTab === 'basic' ? 'care' : 'family')}
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          ) : (
            <Button type="submit" loading={loading}>
              {isEdit ? 'Save Changes' : 'Create Lead'}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
