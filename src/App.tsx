import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { EventPage } from './pages/EventPage'
import { Home } from './pages/Home'
import { Intro } from './pages/Intro'
import { NotFound } from './pages/NotFound'

function HomeTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname === '/') {
      document.title = 'Eventbrite - Discover the Best Local Events & Things to Do'
      window.scrollTo(0, 0)
    }
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <HomeTitle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/e/:slug" element={<EventPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
