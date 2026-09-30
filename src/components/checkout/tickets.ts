import { checkoutCaptures, type EbEvent, type Ticket } from '../../data'
import { money } from '../../utils/format'

const CAPTURED: Record<string, Ticket[]> = {
  // Rollingween: ticket list captured from the live checkout popup.
  '1992678897223': checkoutCaptures.paid.tickets,
}

function salesEnd(e: EbEvent) {
  const d = new Date(e.start)
  return `Sales end on ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

function ticket(name: string, price: string, e: EbEvent): Ticket {
  return { name, price, originalPrice: null, fee: null, salesEnd: salesEnd(e), pills: [], description: null }
}

// Only Rollingween's ticket types were captured; other events get tickets derived from their listed price range.
export function ticketsFor(e: EbEvent): Ticket[] {
  if (CAPTURED[e.id]) return CAPTURED[e.id]
  const low = Number(e.offers?.low ?? 0)
  const high = Number(e.offers?.high ?? 0)
  const list = [ticket('General Admission', low > 0 ? money(low) : 'Free', e)]
  if (high > low) list.push(ticket('VIP Admission', money(high), e))
  return list
}

export function unitPrice(t: Ticket) {
  const m = t.price.match(/\$([\d,.]+)/)
  return m ? Number(m[1].replace(/,/g, '')) : 0
}
