import { useState } from 'react';

const FAQS = [
  {
    question: 'What is Business Dashboard?',
    answer:
      'A Business Intelligence platform for small and medium-sized businesses. You upload a sales spreadsheet and get KPIs and charts back, without building a single formula or pivot table.',
  },
  {
    question: 'What file formats can I upload?',
    answer:
      'CSV and Excel (.xlsx) exports, up to 15MB per file — the format most sales tools already export.',
  },
  {
    question: 'Can I manage more than one business?',
    answer:
      'Yes. Every company you create is its own isolated workspace with its own datasets, KPIs and history — switch between them from one account.',
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <h2 className="text-3xl font-semibold text-foreground">FAQ</h2>

          <dl className="flex flex-col divide-y divide-border">
            {FAQS.map((faq, index) => {
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
