interface Props {
  total: number
  answered: number
}

export function ProgressBar({ total, answered }: Props) {
  const pct = Math.round((answered / total) * 100)
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap font-medium">
        {answered}/{total} dijawab
      </span>
    </div>
  )
}
