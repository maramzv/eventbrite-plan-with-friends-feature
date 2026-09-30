import { icons, type SvgData } from '../../data'
import { Svg } from '../Svg'

const soldOutIcon: SvgData = {
  viewBox: '0 0 16 16',
  inner:
    '<path fill-rule="evenodd" d="M8 1.333a6.667 6.667 0 1 0 0 13.334A6.667 6.667 0 0 0 8 1.333Zm3.61 3.99L5.323 11.61A5.333 5.333 0 0 0 11.61 5.323Zm-.943-.943L4.39 10.667a5.333 5.333 0 0 1 6.277-6.287Z"/>',
}

const STYLES: Record<string, { box: string; icon: SvgData | null }> = {
  'sales end soon': { box: 'bg-[#fffcea] border-[#ffde3b]', icon: icons.clock },
  'sold out': { box: 'bg-white border-eb-ink', icon: soldOutIcon },
  'just added': { box: 'bg-[#e7f6e6] border-[#3a8a3d]', icon: null },
}
const DEFAULT = { box: 'bg-[#fde9ec] border-[#e02e46]', icon: icons.flame }

export function UrgencyTag({ label }: { label: string }) {
  const style = STYLES[label.toLowerCase()] ?? DEFAULT
  return (
    <span
      className={`inline-flex h-[26px] items-center gap-0.5 rounded-lg border-[0.8px] py-1 pr-2 pl-1 text-xs leading-4 font-medium tracking-[0.3px] text-eb-ink2 uppercase ${style.box}`}
    >
      <Svg icon={style.icon} className="size-4" />
      {label}
    </span>
  )
}
