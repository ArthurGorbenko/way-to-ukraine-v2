'use client'

import type { Config } from '@/payload-types'
import { useMemo, useState } from 'react'

type DonateMethod = NonNullable<Config['globals']['active-projects']['projects']>[number]['donateMethods'] extends
  | (infer T)[]
  | null
  | undefined
  ? T
  : never

type DonateMethodsProps = {
  methods: DonateMethod[]
}

const defaultMethods: DonateMethod[] = [
  {
    label: 'Monobank',
    details: [
      { label: '2 Ecoflow Delta 2 for SOF', value: 'https://send.monobank.ua/jar/5BKt1DUbx6' },
      {
        label: 'Military truck Steyr 1291 for Engineer company of the 120-th TDF Brigade',
        value: 'https://send.monobank.ua/jar/bB9VYwZiY',
      },
      { label: 'Repair and restoration of damaged STEYR 1291', value: 'https://send.monobank.ua/jar/3dSGvocJoY' },
    ],
  },
  {
    label: 'UniversalBank',
    details: [
      { label: 'IBAN (EUR)', value: 'UA493220010000026006080001211' },
      { label: 'IBAN (USD)', value: 'UA313220010000026007080001210' },
      { label: 'IBAN (CHF)', value: 'UA063220010000026003080001214' },
      { label: 'IBAN (UAH)', value: 'UA583220010000026007080001209' },
      { label: 'Bank', value: 'JSK UNIVERSAL BANK' },
      { label: 'Receiver', value: 'CO CF WAY TO UKRAINE' },
    ],
  },
  {
    label: 'Crypto',
    details: [
      { label: 'BTC', value: '1PgLvcGNwerzKwtDSdvvgPLCgXDYfy8YZW' },
      { label: 'ETH (ERC20)', value: '0x6f69c7fc26f885934d48d0285fb8c1a992e4a2da' },
      { label: 'USDT (TRC20)', value: 'TW8nrwBuTWogBZN9kzChJ3fjg6FFmC5qaC' },
    ],
  },
  {
    label: 'Інше',
    details: [{ label: 'PayPal', value: 'waytoukr@gmail.com' }],
  },
]

export function DonateMethods({ methods }: DonateMethodsProps) {
  const normalized = useMemo(() => {
    const list = methods.filter((method) => Boolean(method?.label))
    return list.length > 0 ? list : defaultMethods
  }, [methods])

  const [activeIndex, setActiveIndex] = useState(0)
  const active = normalized[activeIndex]
  const details = active?.details?.filter((item) => item?.label && item?.value) || []

  return (
    <>
      <section className="donate-methods mt-10 lg:mt-12" aria-label="Методи донату">
        {normalized.map((method, index) => (
          <button
            key={method?.id || method?.label || index}
            className={`donate-method-pill ${index === activeIndex ? 'is-active' : ''}`}
            type="button"
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            <span>{method?.label}</span>
            {index !== activeIndex ? <span className="donate-method-accent" aria-hidden="true" /> : null}
          </button>
        ))}
      </section>

      <section className="donate-method-panel mt-6 lg:mt-8" aria-label="Платіжні реквізити">
        {active?.description ? <p className="donate-method-description">{active.description}</p> : null}

        {details.length > 0 ? (
          <div className="donate-credentials-list">
            {details.map((item, index) => (
              <article key={item.id || `${item.label}-${index}`} className="donate-credential-row">
                <p className="donate-credential-label">{item.label}</p>
                {item.value.startsWith('http://') || item.value.startsWith('https://') ? (
                  <a className="donate-credential-value" href={item.value} rel="noopener noreferrer" target="_blank">
                    {item.value}
                  </a>
                ) : (
                  <p className="donate-credential-value">{item.value}</p>
                )}
              </article>
            ))}
          </div>
        ) : null}

        {active?.actionUrl ? (
          <a
            className="donate-method-cta"
            href={active.actionUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {active.actionLabel || 'Open'}
          </a>
        ) : null}
      </section>
    </>
  )
}
