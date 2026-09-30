import { icons, type EbEvent } from '../../data'
import { Svg } from '../Svg'

export const CHECKOUT_BUTTONS = new Set(['Get tickets', 'Reserve a spot', 'Check availability'])

export function ConversionBar({ event, onCheckout }: { event: EbEvent; onCheckout: () => void }) {
  const { strip, headline, date, button } = event.conversion
  const soldOut = /sold out/i.test(strip ?? '')
  const label = button ?? (soldOut ? 'Explore similar events' : 'Get tickets')
  const opensCheckout = CHECKOUT_BUTTONS.has(label)

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.08)] lg:sticky lg:top-[93px] lg:rounded lg:shadow-[0_2px_4px_rgba(0,0,0,0.05)] lg:ring-1 lg:ring-eb-line">
      {strip && (
        <div
          className={`flex h-6 items-center justify-center gap-1 rounded-t p-1 text-xs font-semibold tracking-[0.1px] uppercase ${
            soldOut ? 'bg-[#e0284a] text-white' : 'bg-[#d9ffd5] text-eb-ink'
          }`}
        >
          {!soldOut && <Svg icon={icons.tag} className="size-3.5" />}
          {strip}
        </div>
      )}
      <div className="flex items-center justify-between gap-4 px-6 py-6">
        <div className="min-w-0">
          <div className="text-base text-eb-ink">{headline}</div>
          <div className="text-[15px] leading-5 text-eb-gray">{date}</div>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <button
            type="button"
            onClick={opensCheckout ? onCheckout : undefined}
            className="h-11 rounded border-[1.6px] border-transparent bg-eb-orange px-3 text-lg leading-5 font-medium whitespace-nowrap text-white"
          >
            {label}
          </button>
          <button
            type="button"
            onClick={() => {
              // Temporary until the Plan with Friends flow is built.
              window.alert('Plan with Friends is coming soon.')
            }}
            className="h-11 rounded border-[1.6px] border-[rgba(145,141,153,0.1)] bg-[rgba(145,141,153,0.1)] px-3 text-lg leading-5 font-medium whitespace-nowrap text-eb-purple"
          >
            Plan with Friends
          </button>
        </div>
      </div>
    </div>
  )
}
