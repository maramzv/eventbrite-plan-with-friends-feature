import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Svg } from '../components/Svg'
import { home } from '../data'

const logo = { ...home.header.logo, inner: home.header.logo.inner.replace(/ fill="[^"]*"/g, '') }

function Journey({ steps, highlight, tone }: { steps: string[]; highlight: number; tone: 'bad' | 'good' }) {
  return (
    <ol className="mt-10 flex flex-col gap-3 md:flex-row md:items-stretch">
      {steps.map((s, i) => {
        const hot = i === highlight
        const hotStyle = tone === 'bad' ? 'bg-[#fde9ec] ring-2 ring-[#e02e46] text-eb-purple' : 'bg-eb-orange2 text-white'
        return (
          <li key={s} className="flex items-center gap-3 md:flex-1 md:flex-col md:items-stretch">
            <div
              className={`flex flex-1 items-center gap-3 rounded-2xl px-5 py-4 text-lg leading-6 font-medium md:flex-col md:items-start md:py-6 ${
                hot ? hotStyle : 'bg-white text-eb-purple ring-1 ring-eb-line'
              }`}
            >
              <span className="text-sm font-semibold opacity-60">0{i + 1}</span>
              {s}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

interface Slide {
  bg: string
  content: ReactNode
}

const SLIDES: Slide[] = [
  {
    bg: 'bg-gradient-to-br from-eb-orange2 via-[#f5596f] to-[#8f3bff] text-white',
    content: (
      <>
        <p className="text-lg font-semibold tracking-wide text-white/80 uppercase">A new Eventbrite feature</p>
        <h1 className="mt-4 text-6xl leading-none font-bold md:text-8xl">Plan with Friends</h1>
        <p className="mt-8 max-w-2xl text-2xl leading-snug text-white/90 md:text-3xl">
          Decide together, right on the event page, before anyone buys a ticket.
        </p>
        <p className="mt-12 text-lg font-medium text-white/80">Michelle Sainsbury &amp; Mara Munoz</p>
      </>
    ),
  },
  {
    bg: 'bg-white text-eb-purple',
    content: (
      <>
        <p className="text-lg font-semibold tracking-wide text-eb-orange uppercase">The problem</p>
        <h2 className="mt-4 max-w-4xl text-4xl leading-tight font-bold md:text-6xl">
          Going out is a group decision. Eventbrite has no place to make it.
        </h2>
        <Journey
          tone="bad"
          highlight={2}
          steps={['Discover an event', 'Open the event page', 'Leave to text friends', 'Come back to register']}
        />
        <p className="mt-6 text-lg text-eb-gray">Coordination happens in scattered group chats, far from the event itself.</p>
      </>
    ),
  },
  {
    bg: 'bg-eb-subtle text-eb-purple',
    content: (
      <>
        <p className="text-lg font-semibold tracking-wide text-eb-orange uppercase">Why it matters</p>
        <h2 className="mt-4 text-4xl leading-tight font-bold md:text-5xl">Events are social. The planning should be too.</h2>
        <dl className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            ['94%', 'attend concerts with close friends. Only 19% go alone.', 'Sustainability, 2020'],
            ['79%', 'of 18–35-year-olds plan to attend more events in 2026.', 'Eventbrite 2026 Social Study'],
            ['69%', 'rely on personal networks and word of mouth to discover experiences.', 'Eventbrite 2026 Social Study'],
          ].map(([n, text, source]) => (
            <div key={n} className="rounded-2xl bg-white p-6 ring-1 ring-eb-line">
              <dt className="text-6xl font-bold text-eb-orange md:text-7xl">{n}</dt>
              <dd className="mt-3 text-xl leading-snug">{text}</dd>
              <dd className="mt-4 text-sm text-eb-gray">{source}</dd>
            </div>
          ))}
        </dl>
      </>
    ),
  },
  {
    bg: 'bg-[#fff4ef] text-eb-purple',
    content: (
      <>
        <p className="text-lg font-semibold tracking-wide text-eb-orange uppercase">Our solution</p>
        <h2 className="mt-4 max-w-4xl text-4xl leading-tight font-bold md:text-6xl">
          Keep the group decision inside Eventbrite.
        </h2>
        <Journey
          tone="good"
          highlight={2}
          steps={['Discover an event', 'Open the event page', 'Plan with Friends', 'Friends respond', 'Register together']}
        />
        <ul className="mt-8 grid gap-3 text-lg md:grid-cols-2">
          {[
            'Start a plan from any event page',
            'Invite friends with a link, no account needed',
            "See everyone's interest and availability in one place",
            'Go straight to registration when the group is ready',
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-eb-orange2" />
              {t}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    bg: 'bg-gradient-to-br from-[#8f3bff] via-[#f5596f] to-eb-orange2 text-white',
    content: (
      <>
        <p className="text-lg font-semibold tracking-wide text-white/80 uppercase">Let's see it</p>
        <h2 className="mt-4 max-w-3xl text-5xl leading-tight font-bold md:text-7xl">
          First, Eventbrite as it is today.
        </h2>
        <p className="mt-6 max-w-2xl text-2xl text-white/90">Then, what Plan with Friends adds.</p>
        <Link
          to="/"
          className="mt-12 inline-flex h-16 self-start items-center gap-3 rounded-full bg-white px-10 text-xl font-semibold text-eb-purple shadow-[0_8px_30px_rgba(30,10,60,0.25)] transition-transform hover:scale-105"
        >
          Start the demo
          <span aria-hidden>→</span>
        </Link>
      </>
    ),
  },
]

export function Intro() {
  const [index, setIndex] = useState(0)
  const last = SLIDES.length - 1
  const go = useCallback((i: number) => setIndex(Math.max(0, Math.min(last, i))), [last])

  useEffect(() => {
    document.title = 'Plan with Friends · Intro'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') go(index + 1)
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, go])

  const slide = SLIDES[index]
  const light = index >= 1 && index <= 3

  return (
    <div className={`relative flex min-h-dvh flex-col transition-colors duration-500 ${slide.bg}`}>
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <span className={`flex items-center gap-3 ${light ? 'text-eb-orange2' : 'text-white'}`}>
          <Svg icon={logo} className="h-[22px] w-[127px]" />
          <span className={`text-lg font-medium ${light ? 'text-eb-purple' : 'text-white/80'}`}>+ Plan with Friends</span>
        </span>
        {index < last && (
          <Link to="/" className={`text-base font-medium underline-offset-4 hover:underline ${light ? 'text-eb-gray' : 'text-white/80'}`}>
            Skip to demo
          </Link>
        )}
      </header>

      <main key={index} className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-10 md:px-12">
        {slide.content}
        {index === 0 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="mt-6 size-12 self-start rounded-full bg-white text-xl text-eb-purple transition-transform hover:scale-110"
          >
            →
          </button>
        )}
      </main>

      <footer className="flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex gap-2" role="tablist" aria-label="Slides">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
              onClick={() => go(i)}
              className={`h-2.5 rounded-full transition-all ${i === index ? 'w-8' : 'w-2.5 opacity-40'} ${
                light ? 'bg-eb-purple' : 'bg-white'
              }`}
            />
          ))}
        </div>
        {index === 0 ? (
          <p className="rounded-full px-4 py-2 text-sm font-medium text-white ring-1 ring-white/40">
            Concept prototype · Not affiliated with Eventbrite
          </p>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className={`size-12 rounded-full text-xl ring-1 ${
                light ? 'text-eb-purple ring-eb-purple/30' : 'text-white ring-white/40'
              }`}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              disabled={index === last}
              aria-label="Next slide"
              className={`size-12 rounded-full text-xl disabled:opacity-30 ${
                light ? 'bg-eb-purple text-white' : 'bg-white text-eb-purple'
              }`}
            >
              →
            </button>
          </div>
        )}
      </footer>
    </div>
  )
}
