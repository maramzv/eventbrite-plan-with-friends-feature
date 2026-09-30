import { icons, type EbEvent } from '../../data'
import { Svg } from '../Svg'
import { OrganizerAvatar } from './OrganizerAvatar'

export function OrganizedBy({ event }: { event: EbEvent }) {
  const { organizer, organizerCard, topOrganizer } = event
  const stats = [
    ['Followers', organizerCard.followers],
    ['Events', organizerCard.events],
    ['Hosting', organizerCard.hosting],
  ].filter(([, v]) => v)

  return (
    <section className="mt-10">
      <h2 className="text-2xl leading-8 font-semibold text-eb-ink">Organized by</h2>
      <div className="mt-4 flex flex-col gap-6 rounded-2xl bg-eb-subtle p-6 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-6">
          <OrganizerAvatar src={organizer.image} top={topOrganizer} />
          <div className="min-w-0">
            {topOrganizer && (
              <p className="text-[13.5px] leading-[18px] font-semibold tracking-[0.2px] text-eb-gray uppercase">
                Top Organizer
              </p>
            )}
            <a className="block cursor-pointer pb-3 text-lg leading-6 font-medium text-eb-ink">{organizer.name}</a>
            <dl className="flex gap-6">
              {stats.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[15px] leading-5 text-eb-gray3">{label}</dt>
                  <dd className="text-lg leading-6 font-medium text-eb-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            className="h-12 w-[124px] rounded border-[1.6px] border-[rgba(145,141,153,0.1)] bg-[rgba(145,141,153,0.1)] text-lg leading-5 font-medium text-eb-purple"
          >
            Contact
          </button>
          <button
            type="button"
            className="h-12 w-[124px] rounded border-[1.6px] border-transparent bg-eb-orange text-lg leading-5 font-medium text-white"
          >
            Follow
          </button>
        </div>
      </div>
      <a className="mx-auto mt-4 flex w-fit cursor-pointer items-center gap-2 p-2 text-base text-eb-blue">
        <Svg icon={icons.report} className="size-4" />
        Report this event
      </a>
    </section>
  )
}
