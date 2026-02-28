import type React from 'react'

interface HomeIntroProps {
  data: {
    headline?: string | null
    description?: string | null
  }
}

export const HomeIntro: React.FC<HomeIntroProps> = ({ data }) => {
  return (
    <section className="mx-auto w-full max-w-[1320px] px-5 py-12 text-center lg:px-8 lg:py-16">
      <h2 className="text-3xl font-extrabold text-[#111] lg:text-[48px]">{data?.headline}</h2>
      <div className="mx-auto mt-6 h-[2px] w-[200px] bg-[#021f42]" />
      <p className="mx-auto mt-8 max-w-[920px] text-base font-medium text-[#111] lg:text-[25px]">
        {data?.description}
      </p>
    </section>
  )
}
