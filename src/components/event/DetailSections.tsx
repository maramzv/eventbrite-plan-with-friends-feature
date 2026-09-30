import { useState } from 'react'
import { icons, type EbEvent } from '../../data'
import { capitalize } from '../../utils/format'
import { Svg } from '../Svg'

const STATIC_MAP = 'https://cdn.evbstatic.com/e/_next/static/media/map.2hve6ktt4gqsr.png'

const TRAVEL = [
  { label: 'Driving', icon: icons.travel_driving },
  { label: 'Public transport', icon: icons.travel_transit },
  { label: 'Biking', icon: icons.travel_cycling },
  { label: 'Walking', icon: icons.travel_walking },
]

export function Divider() {
  return <hr className="my-10 border-eb-line" />
}

export function Lineup({ event }: { event: EbEvent }) {
  if (!event.lineup.length) return null
  return (
    <section>
      <h2 className="text-2xl leading-8 font-semibold text-eb-ink">Lineup</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {event.lineup.map((a) => (
          <li key={a.name}>
            <a className="flex cursor-pointer items-center gap-4 rounded border border-eb-line p-4">
              {a.image && <img src={a.image} alt="" className="size-14 rounded-full object-cover" />}
              <span className="flex-1 text-xl leading-6 font-semibold text-eb-ink">{a.name}</span>
              <Svg icon={icons.lineupChevron} className="size-6 text-eb-ink" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

const cardShadow =
  'shadow-[0_0_0_1px_rgba(38,27,54,0.06),0_4px_8px_0_rgba(38,27,54,0.03),inset_0_1px_0_0_rgba(255,255,255,0.09)]'

export function GoodToKnow({ event }: { event: EbEvent }) {
  if (!event.highlights.length && !event.refund) return null
  return (
    <section>
      <h2 className="text-2xl leading-8 font-semibold text-eb-ink">Good to know</h2>
      <div className="mt-4 grid gap-4 px-2 sm:grid-cols-2">
        {event.highlights.length > 0 && (
          <div className={`min-h-[244px] rounded-lg bg-white p-6 ${cardShadow}`}>
            <p className="text-lg leading-6 font-semibold text-eb-ink">Highlights</p>
            <ul className="mt-3.5 space-y-2">
              {event.highlights.map((h) => (
                <li key={h.text} className="flex items-center gap-3 text-lg leading-6 text-eb-gray">
                  <Svg icon={h.icon} className="size-4 shrink-0 text-eb-ink" />
                  {capitalize(h.text)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {event.refund && (
          <div className={`min-h-[244px] rounded-lg bg-white p-6 ${cardShadow}`}>
            <p className="text-lg leading-6 font-semibold text-eb-ink">Refund Policy</p>
            <p className="mt-3.5 text-lg leading-6 text-eb-gray">{event.refund}</p>
          </div>
        )}
      </div>
    </section>
  )
}

export function Location({ event }: { event: EbEvent }) {
  const [name, ...lines] = event.address
  return (
    <section>
      <h3 className="text-2xl leading-8 font-medium text-eb-ink">Location</h3>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row">
        <div className="sm:w-[344px] sm:shrink-0">
          <h3 className="text-lg leading-6 font-medium tracking-[0.1px] text-eb-black">{name}</h3>
          {lines.map((l) => (
            <p key={l} className="text-base leading-5 text-eb-gray">
              {l}
            </p>
          ))}
          <hr className="my-10 border-[#efedf2]" />
          <h4 className="text-lg leading-6 font-medium tracking-[0.1px] text-eb-black">How do you want to get there?</h4>
          <ul className="mt-3 space-y-3">
            {TRAVEL.map((t) => (
              <li key={t.label}>
                <a className="flex cursor-pointer items-center gap-4 text-lg leading-6 text-eb-gray">
                  <span className="flex w-6 justify-center text-eb-blue">
                    <Svg icon={t.icon} className="h-5" />
                  </span>
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative min-h-[300px] flex-1 overflow-hidden">
          <img src={STATIC_MAP} alt="Map" className="absolute inset-0 size-full object-cover" />
          <button
            type="button"
            className="absolute top-1/2 left-1/2 flex h-[43px] -translate-x-1/2 -translate-y-1/2 items-center rounded border-[1.6px] border-eb-gray4 bg-white px-5 text-lg font-medium text-eb-ink"
          >
            Show map
          </button>
        </div>
      </div>
    </section>
  )
}

export function Faqs({ event }: { event: EbEvent }) {
  const [open, setOpen] = useState<number | null>(null)
  if (!event.faqs.length) return null
  return (
    <section>
      <h2 className="text-2xl leading-8 font-semibold text-eb-ink">Frequently asked questions</h2>
      <ul className="mt-4">
        {event.faqs.map((f, i) => (
          <li key={f.question} className="border-b border-eb-line pt-3">
            <button
              type="button"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-3 py-2 text-left text-lg leading-5 text-eb-ink"
            >
              {f.question}
              <Svg
                icon={icons.faqChevron}
                className={`size-6 shrink-0 text-eb-blue transition-transform ${open === i ? 'rotate-180' : ''}`}
              />
            </button>
            {open === i && <p className="pb-4 text-base leading-6 whitespace-pre-line text-eb-gray">{f.answer}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function TagPills({ event }: { event: EbEvent }) {
  if (!event.tags.length) return null
  return (
    <section className="mt-8 mb-8">
      <h2 className="text-2xl leading-8 font-medium text-eb-ink">Still looking for the right event?</h2>
      <h3 className="pb-6 text-base leading-[21.28px] text-eb-ink">
        Explore all events in {event.venue.city ?? 'your area'} and filter by date, category, and more to find the
        perfect fit.
      </h3>
      <ul className="flex flex-wrap gap-2">
        {event.tags.map((t) => (
          <li
            key={t}
            className="flex items-center rounded-2xl border-[0.8px] border-eb-subtle bg-eb-subtle px-3 py-2 text-[15px] leading-[22.5px] text-eb-ink"
          >
            <a className="cursor-pointer">{t}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}
