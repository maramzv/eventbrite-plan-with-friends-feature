import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { EventFooter } from '../components/EventFooter'
import { Header } from '../components/Header'
import { Svg } from '../components/Svg'
import { CheckoutModal } from '../components/checkout/CheckoutModal'
import { ConversionBar } from '../components/event/ConversionBar'
import { Divider, Faqs, GoodToKnow, Lineup, Location, TagPills } from '../components/event/DetailSections'
import { EventHero } from '../components/event/EventHero'
import { EventList } from '../components/event/EventList'
import { OrganizedBy } from '../components/event/OrganizedBy'
import { OrganizerAvatar } from '../components/event/OrganizerAvatar'
import { Overview } from '../components/event/Overview'
import { UrgencyTag } from '../components/event/UrgencyTag'
import { getEventBySlug, icons, type EbEvent } from '../data'
import { compactNumber } from '../utils/format'
import { createPlan } from '../utils/plans'
import { NotFound } from './NotFound'

function OrganizerInfo({ event }: { event: EbEvent }) {
  const { organizer, followers, topOrganizer } = event
  const stats = [
    followers && `${followers} followers`,
    organizer.numEvents != null && `${organizer.numEvents} events`,
    organizer.hostingSince != null && `${organizer.hostingSince}y hosting`,
    organizer.totalAttendees != null && `${compactNumber(organizer.totalAttendees)} total attendees`,
  ].filter(Boolean)

  return (
    <div className="mt-3 flex flex-wrap items-center gap-4">
      <OrganizerAvatar src={organizer.image} top={topOrganizer} />
      <div className="min-w-0">
        {topOrganizer && (
          <p className="text-[13.5px] leading-[18px] font-semibold tracking-[0.2px] text-eb-gray uppercase">
            Top Organizer
          </p>
        )}
        <p className="text-lg leading-6 text-eb-gray">
          by <a className="cursor-pointer font-medium text-eb-ink">{organizer.name}</a>
        </p>
        <p className="text-[15px] leading-5 text-eb-gray">{stats.join('  •  ')}</p>
      </div>
      <button
        type="button"
        className="h-[41px] w-[100px] rounded border border-[#dbdae3] text-[13.5px] font-medium text-eb-ink"
      >
        Follow
      </button>
    </div>
  )
}

function EventDetails({ event }: { event: EbEvent }) {
  const [venueName, city] = event.venueLine
  return (
    <div>
      <h1 className="text-[32px] leading-[35.2px] font-bold text-eb-ink">{event.title}</h1>
      <OrganizerInfo event={event} />
      <ul className="mt-4 space-y-1.5 text-[15px] leading-5 tracking-[0.1px] text-eb-ink">
        {venueName && (
          <li className="flex items-center gap-2">
            <Svg icon={event.icons.pin} className="size-4 shrink-0" />
            <span>
              {venueName}
              {city && <span className="text-eb-gray"> · </span>}
              {city}
            </span>
          </li>
        )}
        {event.dateLine[0] && (
          <li className="flex items-center gap-2">
            <Svg icon={event.icons.calendar} className="size-4 shrink-0" />
            <span>{event.dateLine[0]}</span>
          </li>
        )}
      </ul>
    </div>
  )
}

export function EventPage() {
  const { slug } = useParams()
  const event = getEventBySlug(slug)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [planCreated, setPlanCreated] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  

  useEffect(() => {
    if (event) document.title = `${event.title} Tickets, ${event.dateLine[0] ?? ''} | Eventbrite`
    window.scrollTo(0, 0)
  }, [event])

  if (!event) return <NotFound />

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1200px] px-4 pt-8 pb-28 lg:px-0 lg:pb-0">
        <EventHero images={event.images} title={event.title} />

        <div className="mt-4 flex h-10 items-center justify-between">
          <div>{event.urgency && <UrgencyTag label={event.urgency} />}</div>
          <div className="flex text-eb-blue">
            <button type="button" aria-label="Share this event" className="flex size-10 items-center justify-center rounded-full">
              <Svg icon={event.icons.share} className="size-6" />
            </button>
            <button type="button" aria-label="Like event" className="flex size-10 items-center justify-center rounded-full">
              <Svg icon={icons.like} className="size-6" />
            </button>
          </div>
        </div>

        <div className="mt-3 grid gap-10 lg:grid-cols-[700px_410px] lg:justify-between lg:gap-0">
          <div className="min-w-0">
            <EventDetails event={event} />
            <Overview event={event} />
            {event.lineup.length > 0 && (
              <>
                <Divider />
                <Lineup event={event} />
              </>
            )}
            {(event.highlights.length > 0 || event.refund) && (
              <>
                <Divider />
                <GoodToKnow event={event} />
              </>
            )}
            <Divider />
            <Location event={event} />
            {event.faqs.length > 0 && (
              <>
                <Divider />
                <Faqs event={event} />
              </>
            )}
            <OrganizedBy event={event} />
            <EventList
              title={`More events from ${event.organizer.name}`}
              subtitle={`Discover more events from ${event.organizer.name}, ${
                event.category ? `from ${event.category} ` : ''
              }to other experiences you might love.`}
              items={event.moreFromOrganizer}
            />
            <EventList
              title="You might also like..."
              subtitle="Browse more events with different dates, prices, and formats to find your next great experience."
              items={event.related}
            />
            <TagPills event={event} />
          </div>

          <aside>
            <ConversionBar
              event={event}
              onCheckout={() => setCheckoutOpen(true)}
              onPlanWithFriends={() => {
                createPlan(event.id);
                setPlanCreated(true);
              }}
            />
          </aside>
        </div>
      </main>
      <EventFooter />
      {checkoutOpen && <CheckoutModal event={event} onClose={() => setCheckoutOpen(false)} />}
      {planCreated && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPlanCreated(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-created-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
          >
            <h2 id="plan-created-title" className="text-xl font-semibold text-eb-purple">
              Plan created
            </h2>
            <p className="mt-3 text-[15px] leading-5 text-eb-gray">
              Your Plan with Friends is saved and connected to this event.
            </p> 
            <p className="mt-3 text-[15px] leading-5 text-eb-gray">
            {event.title}
            <br />
            {event.start}
            <br />
            {event.venue.name}, {event.venue.city}, {event.venue.region}
            
            </p>
            
            <p className="mt-3 text-[15px] leading-5 text-eb-gray"></p>
            <p className="mt-3 text-[15px] leading-5 text-eb-gray">
  Group discount available for eligible group bookings.
</p>
            <button
              type="button"
              onClick={() => setInviteOpen(true)}                             
              className="mt-6 h-11 w-full rounded border-[1.6px] border-transparent bg-eb-orange px-3 text-lg leading-5 font-medium text-white"
            >
              Invite Friends
            </button>
          </div>
        </div>
      )}
 {inviteOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
      <h2 className="text-xl font-semibold">Invite Friends</h2>
      <p className="mt-3 text-sm text-gray-600">
        Share this plan with your friends.
      </p>
      <button
        type="button"
        onClick={() => setInviteOpen(false)}
        className="mt-6 h-11 w-full rounded bg-eb-orange px-3 text-white"
      >
        Back
      </button>
    </div>
  </div>
)}
       
   
        </>
  )
}
