import { Section } from "@/components/common/section"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqs } from "@/data/faq"

/**
 * Replaces the previous six hand-written toggles that reached into the DOM with
 * `getElementById` / `classList.toggle`. Radix handles state, keyboard and ARIA.
 */
export function Faq() {
  return (
    <Section
      id="faq"
      size="narrow"
      align="center"
      eyebrow="Questions"
      title="Frequently asked"
    >
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={faq.question}
            value={`faq-${index}`}
            className="surface surface-hover border-b px-5"
          >
            <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  )
}
