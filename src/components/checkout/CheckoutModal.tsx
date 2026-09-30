import { useEffect, useState, type ReactNode } from 'react'
import { checkoutCaptures, icons, type EbEvent, type SvgData } from '../../data'
import { checkoutRange, money } from '../../utils/format'
import { Svg } from '../Svg'
import { DatePicker } from './DatePicker'
import { TicketCard } from './TicketCard'
import { ticketsFor, unitPrice } from './tickets'

const ROLLINGWEEN = '1992678897223'

function Step({ icon, title, children }: { icon: SvgData | null; title: string; children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-eb-line bg-white">
      <p className="flex items-center gap-2 px-5 py-5 text-xl font-semibold text-eb-purple">
        <Svg icon={icon} className="size-5" />
        {title}
      </p>
      {children && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

export function CheckoutModal({ event, onClose }: { event: EbEvent; onClose: () => void }) {
  const multi = event.conversion.button === 'Check availability'
  const tickets = ticketsFor(event)
  const [qty, setQty] = useState<number[]>(() => tickets.map(() => 0))
  const [date, setDate] = useState<Date | null>(null)
  const [timePicked, setTimePicked] = useState(false)
  const [promo, setPromo] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const lines = tickets.map((t, i) => ({ t, q: qty[i] })).filter((l) => l.q > 0)
  const total = lines.reduce((sum, l) => sum + unitPrice(l.t) * l.q, 0)
  const refundDays = event.refund?.match(/up to (\d+) days?/i)?.[1]
  const eye = event.id === ROLLINGWEEN ? checkoutCaptures.paid.eyeOnThis : null
  const showTickets = !multi || timePicked
  const startTime = new Date(event.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const primary = event.conversion.button === 'Reserve a spot' ? 'Register' : 'Continue'

  const ticketList = (
    <div className="space-y-6">
      {tickets.map((t, i) => (
        <TicketCard
          key={t.name}
          ticket={t}
          qty={qty[i]}
          onChange={(n) => setQty((q) => q.map((v, j) => (j === i ? Math.max(0, n) : v)))}
        />
      ))}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-0 sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={event.title}
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full max-h-[720px] w-full max-w-[1080px] overflow-hidden bg-white sm:h-[720px]"
      >
        <div className="flex min-w-0 flex-1 flex-col">
          {!multi && (
            <header className="border-b border-eb-line px-12 py-4 text-center">
              <h2 className="text-xl text-eb-purple">{event.title}</h2>
              <p className="mt-1 text-[13px] text-eb-gray">{checkoutRange(event.start, event.end)}</p>
            </header>
          )}

          <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-[82px]">
            {multi ? (
              <div className="space-y-4">
                <h2 className="pb-2 text-2xl font-bold text-eb-purple">Choose options</h2>
                <Step icon={icons.calendarSmall} title="Date">
                  <DatePicker start={event.start} selected={date} onSelect={setDate} />
                </Step>
                <Step icon={icons.clock} title="Time">
                  {date && (
                    <button
                      type="button"
                      onClick={() => setTimePicked(true)}
                      className={`rounded border px-4 py-2 text-[15px] font-medium ${
                        timePicked ? 'border-eb-blue bg-eb-blue text-white' : 'border-[#dbdae3] text-eb-purple'
                      }`}
                    >
                      {startTime}
                    </button>
                  )}
                </Step>
                <Step icon={icons.tag} title="Tickets">
                  {showTickets && ticketList}
                </Step>
              </div>
            ) : (
              <>
                <fieldset className="mb-6 flex h-[52px] items-center rounded border border-[#8c8a96] px-5">
                  <legend className="px-1 text-[13px] text-eb-ink">Promo Code</legend>
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Enter code"
                    aria-label="Promo code"
                    className="min-w-0 flex-1 text-base outline-none placeholder:text-eb-gray"
                  />
                  <button type="button" disabled={!promo} className="text-base text-eb-blue disabled:text-eb-gray4">
                    Apply
                  </button>
                </fieldset>
                {ticketList}
              </>
            )}
          </div>

          {eye && (
            <p className="flex items-center justify-center gap-2 bg-[#c9f5dc] py-2 text-sm font-medium text-eb-purple">
              <Svg icon={icons.eye} className="size-4" />
              {eye}
            </p>
          )}
          {showTickets && (
            <footer className="flex items-center justify-between gap-4 border-t border-eb-line px-6 py-4 sm:px-[82px]">
              <span className="flex items-center gap-1 text-[13px] text-eb-gray">
                <Svg icon={icons.lock} className="size-4" />
                You won't be charged yet
              </span>
              <button type="button" className="h-11 rounded bg-eb-orange px-8 text-[15px] font-semibold text-white">
                {primary}
              </button>
            </footer>
          )}
        </div>

        <aside className="hidden w-[360px] shrink-0 flex-col bg-eb-subtle md:flex">
          <img src={event.images[0]} alt="" className="h-[180px] w-full object-cover" />
          {multi && <p className="px-8 pt-8 text-xl leading-6 font-semibold text-eb-purple">{event.title}</p>}
          {!multi && refundDays && (
            <div className="mx-[30px] mt-6 overflow-hidden rounded">
              <p className="flex items-center justify-center gap-1.5 bg-[#c9f5dc] py-1.5 text-[15px] font-semibold text-[#15733d]">
                <Svg icon={icons.shield} viewBox="0 0 16 16" className="size-4" />
                Easy refunds
              </p>
              <p className="bg-[#eeedf2] px-3 py-2 text-[15px] leading-5 text-eb-gray">
                Cancel up to <strong className="font-semibold text-eb-ink">{refundDays} days</strong> before the event
                and get your ticket refunded
              </p>
            </div>
          )}
          {lines.length ? (
            <div className="px-8 pt-8">
              <p className="pb-4 text-base font-semibold text-eb-purple">Order summary</p>
              <ul className="space-y-2 text-[15px] text-eb-gray">
                {lines.map((l) => (
                  <li key={l.t.name} className="flex justify-between gap-4">
                    <span>
                      {l.q} x {l.t.name}
                    </span>
                    <span>{unitPrice(l.t) ? money(unitPrice(l.t) * l.q) : 'Free'}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex justify-between border-t border-[#dbdae3] pt-4 text-base font-semibold text-eb-purple">
                <span>Total</span>
                <span>{money(total)}</span>
              </p>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-eb-gray4">
              <Svg icon={icons.cart} className="size-12" />
            </div>
          )}
        </aside>

        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full bg-[#dbdae3]/90 text-eb-ink"
        >
          <Svg icon={icons.close} className="size-6" />
        </button>
      </div>
    </div>
  )
}
