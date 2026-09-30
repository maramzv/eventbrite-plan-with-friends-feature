// Organizer photo with the orange "top organizer" badge Eventbrite overlays on the bottom-right.
export function OrganizerAvatar({ src, top }: { src: string | null; top: boolean }) {
  return (
    <span className="relative size-[76px] shrink-0">
      {src ? (
        <img src={src} alt="" className="size-full rounded-full object-cover" />
      ) : (
        <span className="block size-full rounded-full border border-eb-line bg-eb-subtle" />
      )}
      {top && (
        <span className="absolute right-0 bottom-0 flex size-6 items-center justify-center rounded-full border-2 border-white bg-eb-orange2">
          <svg viewBox="0 0 16 16" className="size-3.5 text-white" fill="currentColor" aria-hidden>
            <path d="M2 5.5 5 8l3-4.5L11 8l3-2.5-1.2 6.5H3.2L2 5.5Z" />
          </svg>
        </span>
      )}
    </span>
  )
}
