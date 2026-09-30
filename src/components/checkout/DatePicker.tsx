const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS_SHOWN = 4

function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString()
}

interface DatePickerProps {
  start: string
  selected: Date | null
  onSelect: (d: Date) => void
}

// Repeating events: every week on the same weekday as the series' first session, from today onward.
export function DatePicker({ start, selected, onSelect }: DatePickerProps) {
  const weekday = new Date(start).getDay()
  const today = new Date(new Date().toDateString())
  const from = new Date(start) > today ? new Date(new Date(start).toDateString()) : today
  const available = (d: Date) => d.getDay() === weekday && d >= from
  const firstOpen = new Date(from)
  firstOpen.setDate(from.getDate() + ((weekday - from.getDay() + 7) % 7))
  const months = Array.from(
    { length: MONTHS_SHOWN },
    (_, i) => new Date(firstOpen.getFullYear(), firstOpen.getMonth() + i, 1),
  )

  return (
    <div className="max-h-[370px] overflow-y-auto px-2">
      <div className="sticky top-0 grid grid-cols-7 bg-white py-2 text-center text-sm text-eb-gray">
        {DAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      {months.map((m) => {
        const offset = m.getDay()
        const count = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate()
        return (
          <div key={m.toISOString()} className="pb-4">
            <p className="py-3 pl-2 text-sm font-medium text-eb-purple">
              {m.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <div className="grid grid-cols-7 gap-y-2 text-center">
              {Array.from({ length: offset }, (_, i) => (
                <span key={`pad-${i}`} />
              ))}
              {Array.from({ length: count }, (_, i) => {
                const d = new Date(m.getFullYear(), m.getMonth(), i + 1)
                const ok = available(d)
                const isSel = selected && sameDay(d, selected)
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!ok}
                    onClick={() => onSelect(d)}
                    className={`mx-auto flex size-10 items-center justify-center rounded-full text-[15px] ${
                      isSel
                        ? 'bg-eb-blue font-semibold text-white'
                        : ok
                          ? 'font-medium text-eb-purple hover:bg-eb-subtle'
                          : 'text-eb-gray4 line-through'
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
