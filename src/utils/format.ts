export function compactNumber(n: number | null | undefined) {
  if (n == null) return ''
  if (n < 1000) return String(n)
  const k = n / 1000
  return `${k >= 100 ? Math.round(k) : Math.round(k * 10) / 10}k`
}

export function money(amount: number) {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

function parts(local: string) {
  const d = new Date(local)
  const month = d.toLocaleDateString('en-US', { month: 'long' })
  const hour = d.getHours() % 12 || 12
  const min = d.getMinutes()
  const time = `${hour}${min ? `:${String(min).padStart(2, '0')}` : ''}${d.getHours() < 12 ? 'am' : 'pm'}`
  return { date: `${month} ${d.getDate()}`, time, day: d.toDateString() }
}

// Matches the checkout modal subtitle, e.g. "October 31 · 10pm - November 1 · 4am EDT".
export function checkoutRange(start: string, end: string) {
  const s = parts(start)
  const e = parts(end)
  return s.day === e.day ? `${s.date} · ${s.time} - ${e.time} EDT` : `${s.date} · ${s.time} - ${e.date} · ${e.time} EDT`
}

export function capitalize(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s
}
