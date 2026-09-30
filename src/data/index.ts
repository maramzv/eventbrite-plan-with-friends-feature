import checkoutJson from './checkout.json'
import eventFooterJson from './event-footer.json'
import eventsJson from './events.json'
import homeJson from './home.json'
import iconsJson from './icons.json'

// All JSON in this folder was extracted from captured Eventbrite pages.
// HTML and SVG markup were sanitized during extraction (formatting tags / SVG shapes only).

export interface SvgData {
  viewBox: string | null
  inner: string
}

export interface ListItem {
  title: string | null
  url: string | null
  tag: string | null
  lines: string[]
  promoted: boolean
  image: string | null
}

export type Module = { type: 'text'; html: string } | { type: 'image'; url: string } | { type: string }

export interface EbEvent {
  id: string
  slug: string
  title: string
  summary: string | null
  start: string
  end: string
  isFree: boolean
  isSeries: boolean
  isOnline: boolean
  organizer: {
    name: string
    image: string | null
    top: boolean
    numEvents: number | null
    hostingSince: number | null
    totalAttendees: number | null
  }
  venue: { name: string | null; city: string | null; region: string | null }
  images: string[]
  category: string | null
  modules: Module[]
  faqs: { question: string; answer: string }[]
  offers: { low: string; high: string } | null
  urgency: string | null
  followers: string | null
  topOrganizer: boolean
  venueLine: string[]
  dateLine: string[]
  conversion: { strip: string | null; headline: string | null; date: string | null; button: string | null }
  address: string[]
  highlights: { icon: SvgData | null; text: string }[]
  refund: string | null
  organizerCard: { followers: string | null; events: string | null; hosting: string | null }
  lineup: { name: string | null; image: string | null }[]
  moreFromOrganizer: ListItem[]
  related: ListItem[]
  tags: string[]
  icons: { share: SvgData | null; pin: SvgData | null; calendar: SvgData | null }
}

export interface HomeCard {
  id: string
  url: string
  title: string
  image: string | null
  tag: string | null
  lines: string[]
  promoted: boolean
}

export interface HomeData {
  header: {
    logo: SvgData
    searchIcon: SvgData
    pinIcon: SvgData
    searchButtonIcon: SvgData
    chevronIcon: SvgData
  }
  hero: { desktop: string; sources: { media: string; srcset: string }[]; alt: string }
  categories: { label: string; icon: SvgData | null }[]
  cards: HomeCard[]
  destinations: { name: string; image: string }[]
  pillSections: { heading: string; links: string[] }[]
  arrowIcons: SvgData[]
  pillArrowIcon: SvgData | null
  footer: { columns: { heading: string; links: string[] }[]; bottom: string[] }
}

export interface EventFooterData {
  columns: { heading: string; links: string[] }[]
  bottomLinks: string[]
  copyright: string
  logos: SvgData[]
}

export interface Ticket {
  name: string
  price: string
  originalPrice: string | null
  fee: string | null
  salesEnd: string | null
  pills: string[]
  description: string | null
}

export interface CheckoutCapture {
  title: string | null
  subtitle: string | null
  primaryButton: string | null
  tickets: Ticket[]
  eyeOnThis: string | null
}

export const events = eventsJson as unknown as EbEvent[]
export const home = homeJson as unknown as HomeData
export const eventFooter = eventFooterJson as unknown as EventFooterData
export const icons = iconsJson as unknown as Record<string, SvgData>
export const checkoutCaptures = checkoutJson as unknown as Record<'paid' | 'multidate', CheckoutCapture>

const byId = new Map(events.map((e) => [e.id, e]))
const bySlug = new Map(events.map((e) => [e.slug, e]))

export function getEventBySlug(slug: string | undefined) {
  return slug ? bySlug.get(slug) : undefined
}

export function eventPath(e: EbEvent) {
  return `/e/${e.slug}`
}

export function pathForEventUrl(url: string | null) {
  const id = url?.match(/-(\d+)(?:[?#/]|$)/)?.[1]
  const e = id ? byId.get(id) : undefined
  return e ? eventPath(e) : null
}
