import { Media } from '@/components/Media'
import type { Homepage as HomepageGlobal, Media as MediaType } from '@/payload-types'
import Link from 'next/link'
import type React from 'react'

type MediaResource = string | number | MediaType | null | undefined

interface HomeHeroProps {
  data: HomepageGlobal['hero']
}

export const HomeHero: React.FC<HomeHeroProps> = ({ data }) => {
  return (
    <section className="home-hero relative min-h-[600px] overflow-hidden pt-[84px] lg:min-h-[760px]">
      <div className="absolute inset-0">
        {data?.backgroundImage ? (
          <Media resource={data.backgroundImage as MediaResource} imgClassName="h-full w-full object-cover" priority />
        ) : null}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#021f42]/90 via-[#021f42]/35 to-white/0" />
      <div className="absolute bottom-0 h-52 w-full bg-gradient-to-b from-transparent to-white" />

      <div className="relative mx-auto grid w-full max-w-[1320px] gap-10 px-5 pb-20 pt-10 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:px-8 lg:pb-28 lg:pt-16">
        <div>
          <h1 className="font-sans text-[54px] font-medium uppercase leading-[0.95] text-white md:text-[82px] lg:text-[96px]">
            <span className="block">{data?.titleLine1 || 'WAY TO'}</span>
            <span className="block">{data?.titleLine2 || 'UKRAINE'}</span>
          </h1>
          <div className="mt-8 hidden items-center gap-3 md:flex">
            <span className="inline-block h-3 w-8 -skew-x-[35deg] bg-[#ffbc00]" />
            <span className="inline-block h-3 w-8 -skew-x-[35deg] bg-[#ffbc00]" />
            <span className="inline-block h-3 w-8 -skew-x-[35deg] bg-[#ffbc00]" />
            <span className="ml-3 inline-block h-3 w-8 -skew-x-[35deg] bg-[#3366cb]" />
            <span className="inline-block h-3 w-8 -skew-x-[35deg] bg-[#3366cb]" />
            <span className="inline-block h-3 w-8 -skew-x-[35deg] bg-[#3366cb]" />
          </div>
        </div>

        <div className="ml-auto w-full max-w-[640px] text-white">
          <div className="rounded-[38px] border-[2px] border-white/85 px-8 py-6">
            <p className="text-[32px] font-black uppercase tracking-[0.02em]">
              {data?.currentCollectionTitle || 'ПОТОЧНИЙ ЗБІР'}
            </p>
          </div>
          <div className="mt-6 text-[36px] font-extrabold leading-tight text-[#ffbc00]">
            {data?.currentCollectionSubtitle || 'Збір на пікап'}
          </div>
          <div className="text-[36px] font-bold leading-tight text-white">
            {data?.currentCollectionDescription || 'для 1 ОШБ «Вовки да Вінчі»'}
          </div>
          <div className="mt-7 flex justify-end">
            <Link
              href={data?.currentCollectionDonateUrl || '#'}
              className="rounded-full bg-[#ffbc00] px-8 py-3 text-lg font-black text-[#021f42]"
            >
              {data?.currentCollectionDonateLabel || 'ЗАДОНАТИТИ'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
