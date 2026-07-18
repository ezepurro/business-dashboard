import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Faq {
  question: string;
  answer: string;
}

export function FaqAccordion() {
  const { t } = useTranslation();
  const faqs = t('landing.faq.items', { returnObjects: true }) as Faq[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <h2 className="text-3xl font-semibold text-foreground">{t('landing.faq.heading')}</h2>

          <dl className="flex flex-col divide-y divide-border">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={faq.question} className="py-5">
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
                    >
                      <span className="text-base font-medium text-foreground">{faq.question}</span>
                      <span className="shrink-0 text-xl leading-none text-primary">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                  </dt>
                  {isOpen && (
                    <dd className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground-secondary">
                      {faq.answer}
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
