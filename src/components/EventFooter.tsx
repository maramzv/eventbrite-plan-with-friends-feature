import { eventFooter } from '../data'
import { Svg } from './Svg'

const bottomLinks = ['Manage Cookie Preferences', 'Do Not Sell or Share My Personal Information', 'Privacy']

export function EventFooter() {
  return (
    <footer className="bg-eb-purple px-8 pt-6 pb-4 text-eb-gray4">
      <div className="mx-auto max-w-[1080px]">
        <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4">
          {eventFooter.columns.map((col) => (
            <div key={col.heading}>
              <h3 className="py-2 text-sm font-semibold text-eb-footer">
                {col.heading === 'Connect with Us' ? 'Connect With Us' : col.heading}
              </h3>
              <ul className="mt-1.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a className="text-[13px] leading-6">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-2">
          <ul className="flex flex-wrap justify-center text-[13px]">
            {bottomLinks.map((l, i) => (
              <li key={l} className="flex items-center">
                <a className="px-4">{l}</a>
                {i < bottomLinks.length - 1 && <span aria-hidden>•</span>}
              </li>
            ))}
          </ul>
          {eventFooter.logos[0] && (
            <Svg icon={eventFooter.logos[0]} className="h-[29px] w-[297px] text-eb-gray2" />
          )}
          <p className="text-sm text-eb-footer">{eventFooter.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
