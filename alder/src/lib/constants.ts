export const LEAD_STATUSES = [
  { value: 'NEW_LEAD', label: 'New Lead', color: 'blue' },
  { value: 'ASSESSING', label: 'Assessing', color: 'indigo' },
  { value: 'TOURING', label: 'Touring', color: 'yellow' },
  { value: 'REFERRED', label: 'Referred', color: 'orange' },
  { value: 'MOVED_IN', label: 'Moved In', color: 'green' },
  { value: 'LOST_CLOSED', label: 'Lost / Closed', color: 'red' },
  { value: 'ON_HOLD', label: 'On Hold', color: 'gray' },
]

export const CARE_LEVELS = [
  { value: 'INDEPENDENT', label: 'Independent Living' },
  { value: 'ASSISTED', label: 'Assisted Living' },
  { value: 'MEMORY_CARE', label: 'Memory Care' },
  { value: 'SKILLED_NURSING', label: 'Skilled Nursing' },
  { value: 'BOARD_CARE', label: 'Board & Care (RCFE)' },
  { value: 'RESPITE', label: 'Respite Care' },
]

export const URGENCY_LEVELS = [
  { value: 'LOW', label: 'Low', color: 'green' },
  { value: 'MEDIUM', label: 'Medium', color: 'yellow' },
  { value: 'HIGH', label: 'High', color: 'orange' },
  { value: 'URGENT', label: 'Urgent', color: 'red' },
]

export const REFERRAL_STATUSES = [
  { value: 'SENT', label: 'Sent', color: 'blue' },
  { value: 'CONTACTED', label: 'Contacted', color: 'indigo' },
  { value: 'TOUR_SCHEDULED', label: 'Tour Scheduled', color: 'yellow' },
  { value: 'TOURED', label: 'Toured', color: 'orange' },
  { value: 'PENDING_DECISION', label: 'Pending Decision', color: 'purple' },
  { value: 'ACCEPTED', label: 'Accepted', color: 'teal' },
  { value: 'MOVED_IN', label: 'Moved In', color: 'green' },
  { value: 'DECLINED', label: 'Declined', color: 'red' },
  { value: 'WAITLISTED', label: 'Waitlisted', color: 'gray' },
]

export const REFERRAL_FEE_STATUSES = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'INVOICED', label: 'Invoiced' },
  { value: 'PAID', label: 'Paid' },
  { value: 'WAIVED', label: 'Waived' },
]

export const COMMUNICATION_TYPES = [
  { value: 'CALL', label: 'Phone Call', icon: 'phone' },
  { value: 'TEXT', label: 'Text Message', icon: 'message' },
  { value: 'EMAIL', label: 'Email', icon: 'mail' },
  { value: 'MEETING', label: 'In-Person Meeting', icon: 'users' },
  { value: 'TOUR', label: 'Community Tour', icon: 'building' },
  { value: 'OTHER', label: 'Other', icon: 'note' },
]

export const MOBILITY_OPTIONS = [
  { value: 'Independent', label: 'Independent' },
  { value: 'Cane', label: 'Cane' },
  { value: 'Walker', label: 'Walker' },
  { value: 'Rollator', label: 'Rollator' },
  { value: 'Wheelchair', label: 'Wheelchair' },
  { value: 'Assisted', label: 'Needs Assistance' },
  { value: 'Bedridden', label: 'Mostly Bedridden' },
]

export const TIMELINE_OPTIONS = [
  { value: 'ASAP', label: 'ASAP (within days)' },
  { value: '1-2 weeks', label: '1-2 Weeks' },
  { value: '1 month', label: 'Within 1 Month' },
  { value: '1-2 months', label: '1-2 Months' },
  { value: '2-3 months', label: '2-3 Months' },
  { value: '3-6 months', label: '3-6 Months' },
  { value: '6+ months', label: '6+ Months (Planning Ahead)' },
]

export const PREFERRED_CONTACT_OPTIONS = [
  { value: 'PHONE', label: 'Phone' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'TEXT', label: 'Text' },
]

export const RELATIONSHIP_OPTIONS = [
  { value: 'Spouse', label: 'Spouse / Partner' },
  { value: 'Son', label: 'Son' },
  { value: 'Daughter', label: 'Daughter' },
  { value: 'Sibling', label: 'Sibling' },
  { value: 'Friend', label: 'Friend' },
  { value: 'POA', label: 'Power of Attorney' },
  { value: 'Guardian', label: 'Legal Guardian' },
  { value: 'Other', label: 'Other' },
]

export const REFERRAL_FEE_TYPES = [
  { value: 'FLAT', label: 'Flat Fee ($)' },
  { value: 'PERCENT', label: 'Percentage of Monthly Rate (%)' },
]

export const BADGE_COLORS: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  orange: 'bg-orange-100 text-orange-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  gray: 'bg-gray-100 text-gray-700',
  purple: 'bg-purple-100 text-purple-800',
  teal: 'bg-teal-100 text-teal-800',
}
