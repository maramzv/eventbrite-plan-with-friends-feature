import { useState } from 'react'
import type { EbEvent, Module } from '../../data'

function ModuleView({ m }: { m: Module }) {
  if (m.type === 'text' && 'html' in m) {
    // Sanitized to formatting tags only when the data was extracted.
    return <div className="eb-rich" dangerouslySetInnerHTML={{ __html: m.html }} />
  }
  if (m.type === 'image' && 'url' in m) {
    return <img src={m.url} alt="" loading="lazy" className="mb-3 w-full" />
  }
  return null
}

export function Overview({ event }: { event: EbEvent }) {
  const [open, setOpen] = useState(false)
  const firstImage = event.modules.findIndex((m) => m.type === 'image')
  const preview = firstImage === -1 ? event.modules : event.modules.slice(0, firstImage)
  const hasMore = event.modules.length > 0
  const shown = open ? event.modules : preview

  return (
    <section className="mt-8">
      <h2 className="text-2xl leading-8 font-semibold text-eb-ink">Overview</h2>
      <div className={`relative mt-4 ${open ? '' : 'max-h-[344px] overflow-hidden'}`}>
        {event.summary && (
          <p className="pb-3 text-lg leading-[23.94px] tracking-[0.1px] text-eb-gray">{event.summary}</p>
        )}
        {shown.map((m, i) => (
          <ModuleView key={i} m={m} />
        ))}
        {!open && hasMore && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-white/0 to-white" />
        )}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="pt-4 text-lg leading-[23.94px] font-medium text-eb-blue"
        >
          {open ? 'Read less' : 'Read more'}
        </button>
      )}
    </section>
  )
}
