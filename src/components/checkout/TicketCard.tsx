import { useState } from 'react'
import { icons, type Ticket } from '../../data'
import { Svg } from '../Svg'

interface TicketCardProps {
  ticket: Ticket
  qty: number
  onChange: (qty: number) => void
}

export function TicketCard({ ticket, qty, onChange }: TicketCardProps) {
  const [expanded, setExpanded] = useState(false)
  const price = ticket.originalPrice ? ticket.price.replace(ticket.originalPrice, '') : ticket.price
  const description = ticket.description?.replace(/…?See more$/, '')
  const pills = ticket.pills.length ? ticket.pills : ticket.salesEnd ? [ticket.salesEnd] : []

  return (
    <div className={`rounded border ${qty > 0 ? 'border-eb-blue' : 'border-[#dbdae3]'}`}>
      <div className="flex items-center justify-between gap-4 border-b border-[#dbdae3] px-4 py-4">
        <p className="text-lg leading-6 font-medium text-eb-purple">{ticket.name}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={qty === 0}
            onClick={() => onChange(qty - 1)}
            className="flex size-8 items-center justify-center rounded bg-eb-line text-eb-gray disabled:text-eb-gray4"
          >
            <Svg icon={icons.minus} className="size-5" />
          </button>
          <span className="w-4 text-center text-lg font-semibold text-eb-purple">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => onChange(qty + 1)}
            className="flex size-8 items-center justify-center rounded bg-eb-blue text-white"
          >
            <Svg icon={icons.plus} className="size-5" />
          </button>
        </div>
      </div>
      <div className="px-4 py-4">
        <p className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-eb-purple">{price}</span>
          {ticket.originalPrice && <span className="text-sm text-eb-gray2 line-through">{ticket.originalPrice}</span>}
          {ticket.fee && <span className="text-xs text-eb-gray">{ticket.fee}</span>}
        </p>
        {pills.map((p) => (
          <span key={p} className="mt-3 inline-block rounded bg-eb-subtle px-3 py-1 text-[15px] text-eb-ink">
            {p}
          </span>
        ))}
        {description && (
          <p className={`mt-3 text-[15px] leading-6 text-eb-gray ${expanded ? '' : 'line-clamp-2'}`}>
            {description}
          </p>
        )}
        {description && description.length > 110 && (
          <button type="button" onClick={() => setExpanded((e) => !e)} className="text-[15px] text-eb-blue">
            {expanded ? 'See less' : 'See more'}
          </button>
        )}
      </div>
    </div>
  )
}
