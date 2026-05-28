export interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface Lead {
  id: string
  firstName: string
  lastName: string
  age?: number | null
  phone?: string | null
  email?: string | null
  currentCity?: string | null
  preferredLocation?: string | null
  budgetMin?: number | null
  budgetMax?: number | null
  timeline?: string | null
  status: string
  urgencyLevel: string
  notes?: string | null
  careLevel?: string | null
  mobility?: string | null
  medicationSupport: boolean
  memoryDementia: boolean
  fallRisk: boolean
  behavioralConcerns: boolean
  assignedToId?: string | null
  assignedTo?: User | null
  familyContacts?: FamilyContact[]
  referrals?: Referral[]
  communications?: Communication[]
  createdAt: string
  updatedAt: string
}

export interface FamilyContact {
  id: string
  leadId: string
  name: string
  relationship: string
  phone?: string | null
  email?: string | null
  preferredContact?: string | null
  isPrimary: boolean
  createdAt: string
  updatedAt: string
}

export interface Community {
  id: string
  name: string
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  contactPerson?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  careLevels?: string | null
  pricingMin?: number | null
  pricingMax?: number | null
  availability?: string | null
  referralAgreement: boolean
  referralFeeType?: string | null
  referralFeeAmount?: number | null
  notes?: string | null
  referrals?: Referral[]
  createdAt: string
  updatedAt: string
}

export interface Referral {
  id: string
  leadId: string
  lead?: Lead | null
  communityId: string
  community?: Community | null
  referralDate: string
  status: string
  tourDate?: string | null
  followUpDate?: string | null
  moveInDate?: string | null
  referralFeeStatus?: string | null
  referralFeeAmount?: number | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface Communication {
  id: string
  leadId: string
  lead?: Lead | null
  type: string
  date: string
  summary: string
  nextStep?: string | null
  followUpDate?: string | null
  followUpReminder: boolean
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  activeLeads: number
  newThisMonth: number
  referralsSent: number
  toursScheduled: number
  moveIns: number
  estimatedRevenue: number
  needsFollowUp: Lead[]
  recentCommunications: Communication[]
}
