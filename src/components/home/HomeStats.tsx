import { Media } from '@/components/Media'
import type { Homepage as HomepageGlobal, Media as MediaType } from '@/payload-types'
import type React from 'react'

type MediaResource = string | number | MediaType | null | undefined

type StatBlock =
  | NonNullable<HomepageGlobal['stats']>['left']
  | NonNullable<HomepageGlobal['stats']>['right']

interface HomeStatsProps {
  stats?: HomepageGlobal['stats'] | null
}

const StatIcon = ({ block }: { block?: StatBlock | null }) => {
  if (block?.iconStyle === 'custom' && block.customIcon) {
    return <Media resource={block.customIcon as MediaResource} imgClassName="h-full w-full object-contain" />
  }

  if (block?.iconStyle === 'diamond') {
    return (
      <div className="grid h-full w-full place-items-center text-white">
        <div className="h-8 w-8 rotate-45 border-2 border-current" />
      </div>
    )
  }

  return <div className="grid h-full w-full place-items-center text-4xl font-bold text-white">₴</div>
}

const StatPanel = ({
  block,
  className,
}: {
  block?: StatBlock | null
  className: string
}) => {
  return (
    <div className={`flex min-h-[170px] flex-col items-center justify-center px-6 py-8 text-center ${className}`}>
      <div className="mb-5 h-[72px] w-[72px] rounded-full border-2 border-[#ffbc00]">
        <StatIcon block={block} />
      </div>
      <p className="text-[24px] font-extrabold text-white lg:text-[40px]">{block?.value}</p>
      <p className="text-sm text-white/95 lg:text-[20px]">{block?.caption}</p>
    </div>
  )
}

export const HomeStats: React.FC<HomeStatsProps> = ({ stats }) => {
  return (
    <section className="mx-auto w-full max-w-[1320px] px-5 pb-10 lg:px-8">
      <div className="overflow-hidden rounded-[28px] lg:grid lg:grid-cols-2">
        <StatPanel block={stats?.left} className="bg-[#021f42]" />
        <StatPanel block={stats?.right} className="bg-[#3366cb]" />
      </div>
    </section>
  )
}
