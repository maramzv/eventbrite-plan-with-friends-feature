import { home, icons } from '../data'
import { Svg } from './Svg'

const { columns, bottom } = home.footer
const links = [
  'How It Works',
  'Pricing',
  'Contact Support',
  'About',
  'Blog',
  'Help',
  'Careers',
  'Press',
  'Impact',
  'Security',
  'Developers',
  'Status',
  'Terms',
  'Privacy',
  'Accessibility',
  'Cookies',
  'Manage Cookie Preferences',
  'Do Not Sell or Share My Personal Information',
]
const locales = [...new Set(bottom.slice(bottom.indexOf('Locale') + 1))]

export function HomeFooter() {
  return (
    <footer className="bg-eb-purple text-eb-footer">
      <div className="grid grid-cols-2 gap-y-6 px-6 pt-4 pb-3 md:grid-cols-4">
        {columns.map((col) => (
          <div key={col.heading}>
            <p className="py-2 text-sm font-semibold">{col.heading}</p>
            <ul className="mt-2">
              {col.links.map((l) => (
                <li key={l}>
                  <a className="text-xs leading-6 text-eb-footer-link">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 border-t border-white/20 px-6 py-4 text-xs leading-6 md:flex-row md:items-center">
        <span className="shrink-0 md:w-[229px]">© 2026 Eventbrite</span>
        <ul className="flex flex-1 flex-wrap justify-center">
          {links.map((l, i) => (
            <li key={l} className="flex items-center">
              <a className="px-2">{l}</a>
              {i < links.length - 1 && <span aria-hidden>•</span>}
            </li>
          ))}
        </ul>
        <label className="relative flex shrink-0 items-center md:w-[229px] md:justify-end">
          <span className="sr-only">Locale</span>
          <select
            defaultValue="United States"
            className="appearance-none bg-transparent pr-6 text-sm text-eb-footer outline-none"
          >
            {locales.map((l) => (
              <option key={l} value={l} className="text-black">
                {l}
              </option>
            ))}
          </select>
          <Svg icon={icons.faqChevron} className="pointer-events-none absolute right-0 size-5 text-eb-gray2" />
        </label>
      </div>
    </footer>
  )
}
