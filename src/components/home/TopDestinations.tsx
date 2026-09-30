import { useRef } from 'react'
import { home } from '../../data'
import { Svg } from '../Svg'

const [prevIcon, nextIcon] = home.arrowIcons
const STEP = 336 + 24

export function TopDestinations() {
  const rail = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => rail.current?.scrollBy({ left: dir * STEP * 3, behavior: 'smooth' })

  return (
    <section className="pt-20">
      <div className="mx-auto flex max-w-[1272px] items-center justify-between px-4">
        <h2 className="text-2xl leading-8 font-semibold tracking-[0.25px] text-eb-purple">
          Top destinations in United States
        </h2>
        <div className="flex gap-2">
          {[
            { icon: prevIcon, dir: -1, label: 'Previous' },
            { icon: nextIcon, dir: 1, label: 'Next' },
          ].map(({ icon, dir, label }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={() => scroll(dir)}
              className="flex size-11 items-center justify-center rounded-full border-[1.6px] border-[#dddae3] bg-white text-eb-ink2"
            >
              <Svg icon={icon} className="size-6" />
            </button>
          ))}
        </div>
      </div>

      <div
        ref={rail}
        className="no-scrollbar mt-12 flex gap-6 overflow-x-auto pr-4 pl-[max(16px,calc((100vw-1272px)/2))]"
      >
        {home.destinations.map((d) => (
          <a key={d.name} className="relative block w-[336px] shrink-0 cursor-pointer">
            <img
              src={d.image}
              alt={d.name}
              loading="lazy"
              className="h-[208px] w-full rounded-t-[40px] border-b-[6px] border-eb-orange2 object-cover"
            />
            <p className="absolute bottom-6 left-4 text-[32px] leading-10 font-semibold text-eb-subtle">{d.name}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
