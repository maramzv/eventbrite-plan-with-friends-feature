import { home } from '../../data'
import { Svg } from '../Svg'

function chunk<T>(items: T[], rows: number) {
  const size = Math.ceil(items.length / rows)
  return Array.from({ length: rows }, (_, i) => items.slice(i * size, (i + 1) * size))
}

export function PillSection({ heading, links, rows }: { heading: string; links: string[]; rows: number }) {
  return (
    <section className="pt-14">
      <h2 className="mx-auto max-w-[1272px] px-4 text-2xl leading-8 font-semibold tracking-[0.25px] text-eb-purple">
        {heading}
      </h2>
      <div className="no-scrollbar mt-9 flex flex-col gap-4 overflow-x-auto pr-4 pl-[max(16px,calc((100vw-1272px)/2))]">
        {chunk(links, rows).map((row, i) => (
          <ul key={i} className="flex gap-4">
            {row.map((l) => (
              <li key={l} className="inline-flex h-9 shrink-0 items-center rounded-[20px] bg-white">
                <a className="flex cursor-pointer items-center gap-2 py-3 pr-2 pl-3 text-sm leading-[16.8px] font-semibold whitespace-nowrap text-black">
                  {l}
                  <Svg icon={home.pillArrowIcon} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
