import { Link } from 'react-router-dom'
import { events, icons, pathForEventUrl, type HomeCard } from '../../data'
import { Svg } from '../Svg'

const shareIcon = events.find((e) => e.icons.share)?.icons.share ?? null

const TAG_BG: Record<string, string> = {
  'Just added': 'bg-[#e7f6e6]',
}

export function EventCard({ card }: { card: HomeCard }) {
  const to = pathForEventUrl(card.url) ?? '/'
  const [date, venue, ...rest] = card.lines

  return (
    <Link
      to={to}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white pb-4 transition-shadow duration-200 hover:shadow-[0_4px_30px_rgba(30,10,60,0.12)]"
    >
      <div className="relative aspect-[2/1] w-full overflow-hidden bg-eb-line">
        {card.image && (
          <img src={card.image} alt={`${card.title} primary image`} className="size-full object-cover" loading="lazy" />
        )}
        <div className="absolute right-3 bottom-3 hidden gap-2 group-hover:flex">
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-eb-ink shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
            <Svg icon={icons.like} className="size-5" />
          </span>
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-eb-ink shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
            <Svg icon={shareIcon} className="size-5" />
          </span>
        </div>
      </div>

      <div className="px-3 pt-3">
        {card.tag && (
          <span
            className={`mb-1 inline-flex h-8 items-center rounded-lg px-2 text-sm leading-5 font-medium text-eb-purple ${
              TAG_BG[card.tag] ?? 'bg-[#feedea]'
            }`}
          >
            {card.tag}
          </span>
        )}
        <h3 className="text-lg leading-6 font-medium tracking-[0.25px] text-eb-ink2">{card.title}</h3>
        {date && <p className="mt-1 text-sm leading-5 font-medium text-eb-ink2">{date}</p>}
        {venue && <p className="mt-1 text-sm leading-5 text-eb-gray">{venue}</p>}
        {rest.map((line) => (
          <p key={line} className="mt-2 text-sm leading-5 font-medium text-eb-ink2">
            {line}
          </p>
        ))}
        {card.promoted && (
          <p className="mt-1 flex items-center gap-1 text-xs leading-4 text-eb-gray3">
            Promoted
            <Svg icon={icons.info} className="size-4" />
          </p>
        )}
      </div>
    </Link>
  )
}
