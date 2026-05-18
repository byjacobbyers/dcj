'use client'

import SimpleText from '@/components/simple-text'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  normalizeSectionBackground,
  sectionSemanticSurfaceClasses,
  sectionSurfaceAttrs,
} from '@/lib/section-background'
import { sectionPaddingToClass } from '@/lib/section-padding'
import { cn } from '@/lib/utils'
import type { FaqBlockProps } from '@/types/components/faq-block-type'

export default function FaqBlock({
  active = true,
  componentIndex = 0,
  sectionPadding,
  anchor,
  backgroundColor,
  faqs = [],
}: FaqBlockProps) {
  if (!active || !faqs?.length) return null

  const bg = normalizeSectionBackground(backgroundColor)

  return (
    <section
      id={anchor || `faq-block-${componentIndex}`}
      data-background-color={bg}
      {...sectionSurfaceAttrs(bg)}
      className={cn(
        'faq-block flex w-full flex-col items-center gap-6 px-5',
        sectionSemanticSurfaceClasses(bg),
        sectionPaddingToClass(sectionPadding, 'default')
      )}
    >
      <h2 className="text-h2 text-center">FAQ</h2>
      <div className="container rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <div>
          <Accordion type="single" collapsible defaultValue="faq-0" className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-left text-balance">
                  {faq.answer && Array.isArray(faq.answer) ? (
                    <div className="content">
                      <SimpleText content={faq.answer} />
                    </div>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
