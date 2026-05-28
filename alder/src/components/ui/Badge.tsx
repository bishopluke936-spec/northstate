import { BADGE_COLORS } from '@/lib/constants'

interface BadgeProps {
  color?: string
  children: React.ReactNode
  size?: 'sm' | 'md'
  className?: string
}

export default function Badge({ color = 'gray', children, size = 'md', className = '' }: BadgeProps) {
  const colorClass = BADGE_COLORS[color] || BADGE_COLORS.gray
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${colorClass} ${sizeClass} ${className}`}
    >
      {children}
    </span>
  )
}
