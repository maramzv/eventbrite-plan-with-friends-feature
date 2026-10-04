import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
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
import { 
  createPlan, 
  getPlanById, 
  addFriendToPlan, 
  updateFriendStatus, 
  updateFriendAvailability,
  type Friend, 
  type FriendStatus, 
  type FriendAvailability,
  type Plan
} from '../utils/plans'
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
  const [searchParams] = useSearchParams()
  const event = getEventBySlug(slug)
  
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false)
  const [planCreated, setPlanCreated] = useState<boolean>(false)
  const [inviteOpen, setInviteOpen] = useState<boolean>(false)
  const [planId, setPlanId] = useState<string | null>(null)
  const [organizerName, setOrganizerName] = useState<string>('')
  const [planNote, setPlanNote] = useState<string>('')
  const [showOrganizerPrompt, setShowOrganizerPrompt] = useState<boolean>(false)
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendInput, setFriendInput] = useState<string>('')

  // Invited Friend view states
  const [isInvitedView, setIsInvitedView] = useState<boolean>(false)
  const [inviterNameDisplay, setInviterNameDisplay] = useState<string>('Your friend')
  const [planNoteDisplay, setPlanNoteDisplay] = useState<string>('')
  const [invitedNameInput, setInvitedNameInput] = useState<string>('')
  const [currentInvitedIndex, setCurrentInvitedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (event) document.title = `${event.title} Tickets, ${event.dateLine[0] ?? ''} | Eventbrite`
    window.scrollTo(0, 0)
  }, [event])

  // Check URL for an incoming ?plan=<id> on page load
  useEffect(() => {
    const incomingPlanId = searchParams.get('plan')
    if (incomingPlanId) {
      const existingPlan: Plan | null = getPlanById(incomingPlanId)
      if (existingPlan) {
        setPlanId(existingPlan.id)
        if (existingPlan.organizerName) {
          setInviterNameDisplay(existingPlan.organizerName)
        }
        if (existingPlan.note) {
          setPlanNoteDisplay(existingPlan.note)
        }
        const normalizedFriends: Friend[] = existingPlan.friends.map((f: Friend) => ({
          name: f.name,
          status: f.status || 'Pending',
          availability: f.availability || 'Unknown',
          hasResponded: !!f.hasResponded,
        }))
        setFriends(normalizedFriends)
        setIsInvitedView(true)
        setPlanCreated(true)
      }
    }
  }, [searchParams])

  const handleStartPlan = (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return
    const plan: Plan = createPlan(event.id, organizerName || 'Organizer', planNote)
    setPlanId(plan.id)
    setPlanNoteDisplay(plan.note || '')
    setFriends([])
    setIsInvitedView(false)
    setShowOrganizerPrompt(false)
    setPlanCreated(true)
  }

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!planId || !friendInput.trim()) return
    const updated: Plan | null = addFriendToPlan(planId, friendInput)
    if (updated) {
      const normalizedFriends: Friend[] = updated.friends.map((f: Friend) => ({
        name: f.name,
        status: f.status || 'Pending',
        availability: f.availability || 'Unknown',
        hasResponded: !!f.hasResponded,
      }))
      setFriends(normalizedFriends)
      setFriendInput('')
    }
  }

  const handleStatusChange = (index: number, status: FriendStatus) => {
    if (!planId) return
    const updated: Plan | null = updateFriendStatus(planId, index, status)
    if (updated) {
      const normalizedFriends: Friend[] = updated.friends.map((f: Friend) => ({
        name: f.name,
        status: f.status || 'Pending',
        availability: f.availability || 'Unknown',
        hasResponded: !!f.hasResponded,
      }))
      setFriends(normalizedFriends)
    }
  }

  const handleAvailabilityChange = (index: number, availability: FriendAvailability) => {
    if (!planId) return
    const updated: Plan | null = updateFriendAvailability(planId, index, availability)
    if (updated) {
      const normalizedFriends: Friend[] = updated.friends.map((f: Friend) => ({
        name: f.name,
        status: f.status || 'Pending',
        availability: f.availability || 'Unknown',
        hasResponded: !!f.hasResponded,
      }))
      setFriends(normalizedFriends)
    }
  }

  const handleResendInvitation = (friendName: string) => {
    const inviteUrl = `${window.location.origin}${window.location.pathname}?plan=${planId}`
    window.prompt(`Resend invitation link to ${friendName}:`, inviteUrl)
  }

  const handleJoinPlanAsInvitedFriend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!planId || !invitedNameInput.trim()) return
    const updated: Plan | null = addFriendToPlan(planId, invitedNameInput)
    if (updated) {
      const normalizedFriends: Friend[] = updated.friends.map((f: Friend) => ({
        name: f.name,
        status: f.status || 'Pending',
        availability: f.availability || 'Unknown',
        hasResponded: !!f.hasResponded,
      }))
      setFriends(normalizedFriends)
      const newIndex = normalizedFriends.findIndex((f) => f.name.toLowerCase() === invitedNameInput.trim().toLowerCase())
      setCurrentInvitedIndex(newIndex >= 0 ? newIndex : normalizedFriends.length - 1)
      setInvitedNameInput('')
    }
  }

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
                setShowOrganizerPrompt(true)
              }}
            />
          </aside>
        </div>
      </main>
      <EventFooter />
      {checkoutOpen && <CheckoutModal event={event} onClose={() => setCheckoutOpen(false)} />}
      
      {/* Organizer Name & Note Prompt Modal */}
      {showOrganizerPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowOrganizerPrompt(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="organizer-prompt-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setShowOrganizerPrompt(false)}
              aria-label="Close"
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
            <h2 id="organizer-prompt-title" className="text-2xl font-bold text-eb-ink">Start a Plan with Friends</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your name and an optional note for your friends.
            </p>
            <form onSubmit={handleStartPlan} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-eb-ink uppercase tracking-wider mb-1.5">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-eb-orange"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-eb-ink uppercase tracking-wider mb-1.5">Note (Optional)</label>
                <textarea
                  placeholder="e.g. Let's grab dinner beforehand!"
                  value={planNote}
                  onChange={(e) => setPlanNote(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-eb-orange h-24 resize-none"
                />
              </div>
              <button
                type="submit"
                className="h-12 w-full rounded-lg bg-eb-orange text-base font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
              >
                Continue to Plan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Plan Planning Space Modal */}
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
            className="w-full max-w-xl rounded-xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative"
          >
            <button
              type="button"
              onClick={() => setPlanCreated(false)}
              aria-label="Return to event details"
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
            <h2 id="plan-created-title" className="text-2xl font-bold text-eb-ink">
              {isInvitedView ? `${inviterNameDisplay} invited you to a Plan with Friends!` : 'Plan with Friends'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isInvitedView 
                ? `${inviterNameDisplay} shared this plan with you for the following event:` 
                : 'Your plan is saved and connected to this event.'}
            </p> 

            {/* Display Plan Note if present */}
            {planNoteDisplay && (
              <div className="mt-4 bg-orange-50/80 border-l-4 border-eb-orange p-3.5 rounded-r-lg text-sm text-eb-ink shadow-sm">
                <span className="font-semibold text-eb-orange text-xs uppercase tracking-wider block mb-1">Note from {inviterNameDisplay}:</span>
                <p className="italic text-gray-700">"{planNoteDisplay}"</p>
              </div>
            )}

            {/* Event Summary Card */}
            <div className="mt-5 bg-gray-50 p-4 rounded-xl border border-gray-200/70 space-y-1">
              <h3 className="font-bold text-base text-eb-ink">{event.title}</h3>
              <p className="text-xs font-medium text-eb-gray">{event.start}</p>
              <p className="text-xs text-gray-600">{event.venue.name}, {event.venue.city}, {event.venue.region}</p>
              <p className="text-[11px] font-semibold text-eb-orange mt-1">Group discount available for eligible group bookings.</p>
            </div>

            {/* Invited Friend Interest & Availability Response Flow & Invited Friends List */}
            {isInvitedView ? (
              <div className="mt-6 border-t border-gray-200 pt-5 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-eb-ink mb-3">Respond to this plan</h3>
                  {currentInvitedIndex !== null && friends[currentInvitedIndex] ? (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Responding as: <strong className="text-eb-ink font-semibold">{friends[currentInvitedIndex].name}</strong></span>
                        <button
                          type="button"
                          onClick={() => setCurrentInvitedIndex(null)}
                          className="text-eb-blue hover:underline font-medium"
                        >
                          Switch name
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-lg border border-gray-200/80 flex items-center justify-between">
                          <span className="font-medium text-gray-700">Your Interest:</span>
                          <select
                            value={friends[currentInvitedIndex].status}
                            onChange={(e) => handleStatusChange(currentInvitedIndex, e.target.value as FriendStatus)}
                            className="border rounded-md px-2 py-1 bg-gray-50 font-medium text-eb-ink"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Interested">Interested</option>
                            <option value="Going">Going</option>
                          </select>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-gray-200/80 flex items-center justify-between">
                          <span className="font-medium text-gray-700">Availability:</span>
                          <select
                            value={friends[currentInvitedIndex].availability}
                            onChange={(e) => handleAvailabilityChange(currentInvitedIndex, e.target.value as FriendAvailability)}
                            className="border rounded-md px-2 py-1 bg-gray-50 font-medium text-eb-ink"
                          >
                            <option value="Unknown">Unknown</option>
                            <option value="Available">Available</option>
                            <option value="Busy">Busy</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleJoinPlanAsInvitedFriend} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                      <label className="block text-xs font-medium text-gray-700">Enter your name to join and submit your responses:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Your name"
                          value={invitedNameInput}
                          onChange={(e) => setInvitedNameInput(e.target.value)}
                          className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:border-eb-orange bg-white"
                          required
                        />
                        <button
                          type="submit"
                          className="rounded-lg bg-eb-ink px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                        >
                          Join Plan
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Invited Friends List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-eb-ink">Invited Friends</h4>
                    <span className="text-xs text-gray-500 font-medium">{friends.length} invited</span>
                  </div>
                  {friends.length > 0 ? (
                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                      {friends.map((f: Friend, idx: number) => (
                        <li key={idx} className="flex items-center justify-between text-xs bg-gray-50 px-3.5 py-2.5 rounded-lg border border-gray-200/70">
                          <span className="text-eb-ink font-medium flex items-center gap-2">
                            <span className="size-2 rounded-full bg-eb-orange inline-block"></span>
                            {f.name}
                          </span>
                          <span className="text-[11px] text-gray-500 bg-white px-2.5 py-0.5 rounded-md border border-gray-200">Invited</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No other friends invited yet.</p>
                  )}
                </div>

                {/* Summary of group responses */}
                <div>
                  <h4 className="text-sm font-bold text-eb-ink mb-2">Group Responses</h4>
                  {friends.length > 0 ? (
                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                      {friends.map((f: Friend, idx: number) => (
                        <li key={idx} className="flex items-center justify-between text-xs bg-gray-50 px-3.5 py-2.5 rounded-lg border border-gray-200/70">
                          <span className="text-eb-ink font-medium">{f.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md font-semibold ${
                              f.status === 'Going' ? 'bg-green-100 text-green-800' :
                              f.status === 'Interested' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {f.status}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md font-semibold ${
                              f.availability === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                              f.availability === 'Busy' ? 'bg-rose-100 text-rose-800' :
                              'bg-gray-200 text-gray-700'
                            }`}>
                              {f.availability}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No responses yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 border-t border-gray-200 pt-5 space-y-6">
                {/* Aggregate Group Response Summary */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-eb-ink uppercase tracking-wider">Group Response Summary</h3>
                    <span className="text-xs font-medium text-gray-600 bg-white px-2.5 py-1 rounded-md border border-gray-200">
                      {friends.filter((f: Friend) => f.hasResponded).length} of {friends.length} Responded
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-gray-200/70 space-y-1.5">
                      <p className="font-semibold text-gray-700 mb-2">Interest Breakdown</p>
                      <div className="flex justify-between items-center text-gray-600">
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-green-500 inline-block"></span>Going</span>
                        <span className="font-bold text-eb-ink">{friends.filter((f: Friend) => f.status === 'Going').length}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-blue-500 inline-block"></span>Interested</span>
                        <span className="font-bold text-eb-ink">{friends.filter((f: Friend) => f.status === 'Interested').length}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-yellow-500 inline-block"></span>Pending</span>
                        <span className="font-bold text-eb-ink">{friends.filter((f: Friend) => f.status === 'Pending').length}</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-200/70 space-y-1.5">
                      <p className="font-semibold text-gray-700 mb-2">Availability Breakdown</p>
                      <div className="flex justify-between items-center text-gray-600">
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500 inline-block"></span>Available</span>
                        <span className="font-bold text-eb-ink">{friends.filter((f: Friend) => f.availability === 'Available').length}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-rose-500 inline-block"></span>Busy</span>
                        <span className="font-bold text-eb-ink">{friends.filter((f: Friend) => f.availability === 'Busy').length}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-gray-400 inline-block"></span>Unknown</span>
                        <span className="font-bold text-eb-ink">{friends.filter((f: Friend) => f.availability === 'Unknown').length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invited Friends List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-eb-ink">Invited Friends ({friends.length})</h3>
                    <span className="text-xs text-gray-500">Status & Responses</span>
                  </div>
                  {friends.length > 0 ? (
                    <ul className="space-y-3 max-h-60 overflow-y-auto">
                      {friends.map((friend: Friend, idx: number) => (
                        <li key={idx} className="text-sm bg-gray-50 p-3.5 rounded-xl space-y-3 border border-gray-200/70 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-eb-ink flex items-center gap-2">
                              <span className={`size-2.5 rounded-full inline-block ${friend.hasResponded ? 'bg-green-500' : 'bg-amber-400'}`}></span>
                              {friend.name}
                            </span>
                            <div className="flex items-center gap-2.5">
                              {!friend.hasResponded && (
                                <button
                                  type="button"
                                  onClick={() => handleResendInvitation(friend.name)}
                                  className="text-xs text-eb-blue hover:underline font-semibold"
                                >
                                  Resend
                                </button>
                              )}
                              <span className={`text-[11px] px-2.5 py-1 rounded-md font-medium border ${
                                friend.hasResponded 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {friend.hasResponded ? 'Responded' : 'Pending Response'}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-200/60">
                            <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200/60">
                              <span className="text-gray-500">Interest:</span>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded font-semibold ${
                                  friend.status === 'Going' ? 'bg-green-100 text-green-800' :
                                  friend.status === 'Interested' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {friend.status}
                                </span>
                                <select
                                  value={friend.status}
                                  onChange={(e) => handleStatusChange(idx, e.target.value as FriendStatus)}
                                  className="border rounded px-1.5 py-0.5 bg-gray-50 text-xs font-medium"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Interested">Interested</option>
                                  <option value="Going">Going</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200/60">
                              <span className="text-gray-500">Availability:</span>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded font-semibold ${
                                  friend.availability === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                                  friend.availability === 'Busy' ? 'bg-rose-100 text-rose-800' :
                                  'bg-gray-200 text-gray-700'
                                }`}>
                                  {friend.availability}
                                </span>
                                <select
                                  value={friend.availability}
                                  onChange={(e) => handleAvailabilityChange(idx, e.target.value as FriendAvailability)}
                                  className="border rounded px-1.5 py-0.5 bg-gray-50 text-xs font-medium"
                                >
                                  <option value="Unknown">Unknown</option>
                                  <option value="Available">Available</option>
                                  <option value="Busy">Busy</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No friends invited to this plan yet. Use "Invite Friends" below or add friends directly.</p>
                  )}

                  <form onSubmit={handleAddFriend} className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Friend's name or email"
                      value={friendInput}
                      onChange={(e) => setFriendInput(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:border-eb-orange bg-white"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-eb-ink px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                    >
                      Add
                    </button>
                  </form>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setPlanCreated(false)
                  setCheckoutOpen(true)
                }}
                className="h-12 w-full rounded-lg bg-eb-orange text-base font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
              >
                Continue to Registration
              </button>
              <button
                type="button"
                onClick={() => setPlanCreated(false)}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-eb-ink hover:bg-gray-50 transition-colors"
              >
                Back to Event Details
              </button>
              {!isInvitedView && (
                <button
                  type="button"
                  onClick={() => setInviteOpen(true)}                             
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-eb-ink hover:bg-gray-50 transition-colors"
                >
                  Invite Friends
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl space-y-5">
            <h2 className="text-xl font-bold text-eb-ink">Invite Friends</h2>
            <p className="text-sm text-gray-600">
              Share this plan with your friends using your unique invitation link.
            </p>
            <button
              type="button"
              onClick={() => {
                const inviteUrl = `${window.location.origin}${window.location.pathname}?plan=${planId}`
                window.prompt("Copy this invitation link:", inviteUrl)
              }}
              className="h-12 w-full rounded-lg bg-eb-orange text-sm font-semibold text-white hover:bg-orange-600 transition-colors shadow-sm"
            >
              Copy Invitation Link
            </button>
            <button
              type="button"
              onClick={() => setInviteOpen(false)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white text-sm font-medium text-eb-ink hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </>
  )
}