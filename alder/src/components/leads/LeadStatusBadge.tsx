import Badge from '@/components/ui/Badge'
import { LEAD_STATUSES } from '@/lib/constants'

interface LeadStatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

export default function LeadStatusBadge({ status, size = 'md' }: LeadStatusBadgeProps) {
  const statusConfig = LEAD_STATUSES.find((s) => s.value === status)

  if (!statusConfig) {
    return <Badge color="gray" size={size}>{status}</Badge>
  }

  return (
    <Badge color={statusConfig.color} size={size}>
      {statusConfig.label}
    </Badge>
  )
}
