import { useState } from 'react'
import { Header } from '../components/Header'
import { HomeFooter } from '../components/HomeFooter'
import { Svg } from '../components/Svg'
import { EventCard } from '../components/home/EventCard'
import { PillSection } from '../components/home/PillSection'
import { TopDestinations } from '../components/home/TopDestinations'
import { home, icons } from '../data'

const TABS = ['All', 'For you', 'Today', 'This weekend']
const PILL_ROWS: Record<string, number> = { 'Popular cities': 1, 'Explore by State': 2, 'Things to do around New York': 2 }

export function Home() {
  const [tab, setTab] = useState('All')

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-[1272px] pt-4 pb-3">
          <a className="block cursor-pointer">
            <picture>
              {home.hero.sources.map((s) => (
                <source key={s.media} media={s.media} srcSet={s.srcset} type="image/webp" />
              ))}
              <img
                src={home.hero.desktop}
                alt={home.hero.alt}
                className="h-[393px] w-full object-cover md:rounded-[20px]"
              />
            </picture>
          </a>
        </div>

        <section className="py-9">
          <ul className="no-scrollbar mx-auto flex max-w-[1272px] justify-between gap-4 overflow-x-auto px-4 xl:px-0">
            {home.categories.map((c) => (
              <li key={c.label} className="w-[109px] shrink-0">
                <a className="flex cursor-pointer flex-col items-center">
                  <span className="flex size-[107px] items-center justify-center rounded-full border-[0.8px] border-[#dee5ff] bg-white text-eb-ink2">
                    <Svg icon={c.icon} className="size-12" />
                  </span>
                  <span className="mt-3 text-center text-xs leading-[15px] font-medium text-eb-ink">{c.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="border-y border-eb-line">
          <div className="mx-auto flex h-[76px] max-w-[1272px] items-center gap-2 px-4">
            <h1 className="text-lg leading-6 font-medium tracking-[0.25px] text-eb-body">Browsing events in</h1>
            <button type="button" className="ml-6 flex items-center gap-2 text-lg font-medium text-eb-blue">
              <Svg icon={icons.faqChevron} className="size-6" />
              New York
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-[1272px] px-4">
          <div role="tablist" className="mt-4 flex gap-6">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                type="button"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`border-b-[1.6px] pb-3 text-sm leading-5 font-medium ${
                  tab === t ? 'border-eb-blue text-eb-blue' : 'border-transparent text-eb-gray2'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <h2 className="mt-10 text-2xl leading-8 font-semibold tracking-[0.25px] text-eb-purple">Events in New York</h2>
          <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {home.cards.map((card) => (
              <EventCard key={card.id} card={card} />
            ))}
          </div>
        </div>

        <div className="mt-16 bg-eb-subtle pb-20">
          <TopDestinations />
          {home.pillSections.map((s) => (
            <PillSection key={s.heading} heading={s.heading} links={s.links} rows={PILL_ROWS[s.heading] ?? 1} />
          ))}
        </div>
      </main>
      <HomeFooter />
    </>
  )
}
