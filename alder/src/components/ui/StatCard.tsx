interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
  accent?: string
  className?: string
}

export default function StatCard({ label, value, icon, trend, accent = 'teal', className = '' }: StatCardProps) {
  const accentColors: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  }

  return (
    <div className={`card p-5 flex items-start gap-4 ${className}`}>
      <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${accentColors[accent] || accentColors.teal}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 ${trend.positive ? 'text-green-600' : 'text-red-500'}`}>
            {trend.positive ? '+' : ''}{trend.value} {trend.label}
          </p>
        )}
      </div>
    </div>
  )
}
