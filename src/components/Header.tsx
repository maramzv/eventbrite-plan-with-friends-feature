import { Link } from 'react-router-dom'
import { home, icons } from '../data'
import { Svg } from './Svg'

const { logo, searchIcon, pinIcon } = home.header
// The live site colors the wordmark with CSS, so drop the baked-in fills and use currentColor.
const logoIcon = { ...logo, inner: logo.inner.replace(/ fill="[^"]*"/g, '') }

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-eb-line bg-white px-4 py-2 md:px-6">
      <nav className="flex h-11 items-center">
        <Link to="/" aria-label="Eventbrite" className="shrink-0 text-eb-orange2">
          <Svg icon={logoIcon} className="h-[19px] w-[110px]" />
        </Link>

        <div className="ml-[52px] mr-4 hidden h-11 w-[509px] shrink items-center rounded-full border border-eb-line bg-eb-subtle pl-4 md:flex">
          <Svg icon={searchIcon} className="size-5 shrink-0 text-eb-body" />
          <input
            aria-label="Search events"
            placeholder="Search events"
            className="h-full min-w-0 flex-1 bg-transparent px-2 text-base text-eb-body outline-none placeholder:text-eb-gray2"
          />
          <span className="h-8 w-px shrink-0 bg-eb-gray4" />
          <Svg icon={pinIcon} className="ml-6 size-5 shrink-0 text-eb-body" />
          <input
            aria-label="Location"
            defaultValue="New York"
            className="h-full min-w-0 flex-1 bg-transparent px-2 text-base text-eb-body outline-none"
          />
          <button
            type="button"
            aria-label="Search"
            className="mr-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-eb-orange text-white"
          >
            <Svg icon={searchIcon} className="size-5" />
          </button>
        </div>

        <ul className="ml-auto flex items-center text-sm text-eb-body">
          <li className="hidden xl:block">
            <a className="px-4 py-3">Updates</a>
          </li>
          <li className="hidden lg:block">
            <Link to="/" className="px-4 py-3">
              Find Events
            </Link>
          </li>
          <li className="hidden lg:block">
            <a className="mx-2 flex h-10 items-center rounded bg-eb-orange2 px-4 text-white">Create Events</a>
          </li>
          <li className="hidden lg:block">
            <a className="flex items-center gap-1 px-4 py-3">
              Help Center
              <Svg icon={icons.faqChevron} className="size-5" />
            </a>
          </li>
          <li className="hidden lg:block">
            <a className="px-4 py-3">Find my tickets</a>
          </li>
          <li>
            <a className="flex h-10 items-center rounded-full px-4 font-medium">Sign in</a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
