import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { HomeFooter } from '../components/HomeFooter'

export function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[600px] px-4 py-32 text-center">
        <h1 className="text-[32px] font-bold text-eb-purple">Whoops, the page or event you are looking for was not found.</h1>
        <Link to="/" className="mt-8 inline-flex h-11 items-center rounded bg-eb-orange px-6 text-lg font-medium text-white">
          Find events
        </Link>
      </main>
      <HomeFooter />
    </>
  )
}
