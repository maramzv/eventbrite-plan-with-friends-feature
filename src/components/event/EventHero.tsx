import { useState } from 'react'
import { home } from '../../data'
import { Svg } from '../Svg'

const [prevIcon, nextIcon] = home.arrowIcons

export function EventHero({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0)
  const current = images[index]
  const many = images.length > 1
  const go = (dir: number) => setIndex((i) => (i + dir + images.length) % images.length)

  return (
    <div className="relative h-[235px] overflow-hidden bg-eb-line sm:h-[470px]">
      {current && (
        <>
          <img src={current} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover blur-[40px]" />
          <img src={current} alt={title} className="relative mx-auto h-full w-full max-w-[940px] object-cover" />
        </>
      )}

      {many && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="absolute top-1/2 left-3 flex size-10 sm:left-12 sm:size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
          >
            <Svg icon={prevIcon} className="size-6" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="absolute top-1/2 right-3 flex size-10 sm:right-12 sm:size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
          >
            <Svg icon={nextIcon} className="size-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`size-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
