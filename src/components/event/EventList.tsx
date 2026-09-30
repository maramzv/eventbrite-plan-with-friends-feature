import { Link } from 'react-router-dom'
import { icons, pathForEventUrl, type ListItem } from '../../data'
import { Svg } from '../Svg'
import { UrgencyTag } from './UrgencyTag'

function Row({ item }: { item: ListItem }) {
  const [date, ...rest] = item.lines
  const body = (
    <div className="flex items-center justify-between gap-6">
      <div className="min-w-0 sm:w-[467px]">
        {item.tag && <UrgencyTag label={item.tag} />}
        <h3 className="pt-2 text-[21px] leading-[27.93px] font-medium tracking-[0.1px] text-eb-black">{item.title}</h3>
        {date && <p className="pt-2 text-lg leading-6 tracking-[0.2px] text-eb-ink">{date}</p>}
        {rest.map((l) => (
          <p key={l} className="pt-2 text-base leading-5 text-eb-gray2">
            {l}
          </p>
        ))}
        {item.promoted && (
          <p className="mt-2 flex items-center gap-1 text-[9px] leading-[10px] font-semibold text-[#696c71] uppercase">
            Promoted
            <Svg icon={icons.info} className="size-3" />
          </p>
        )}
      </div>
      {item.image && (
        <img src={item.image} alt="" loading="lazy" className="h-[74px] w-[148px] shrink-0 rounded object-cover" />
      )}
    </div>
  )
  const to = pathForEventUrl(item.url)
  return (
    <li className="border-b-[0.8px] border-[rgba(25,22,19,0.1)] py-4">
      {to ? <Link to={to}>{body}</Link> : <a className="block cursor-pointer">{body}</a>}
    </li>
  )
}

export function EventList({ title, subtitle, items }: { title: string; subtitle: string; items: ListItem[] }) {
  if (!items.length) return null
  return (
    <section className="mt-8">
      <h2 className="text-2xl leading-8 font-medium text-eb-ink">{title}</h2>
      <h3 className="pb-6 text-base leading-[21.28px] text-eb-ink">{subtitle}</h3>
      <ul>
        {items.map((item) => (
          <Row key={`${item.url}-${item.title}`} item={item} />
        ))}
      </ul>
    </section>
  )
}
