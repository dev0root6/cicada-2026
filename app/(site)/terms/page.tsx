import type { Metadata } from "next"
import { Section } from "@/components/common/section"

export const metadata: Metadata = {
  title: "Terms & Conditions",
}

const sections = [
  {
    title: "Eligibility",
    items: [
      "Participants must bring a valid student ID card.",
      "Organizers are not responsible for any technical failures, data loss, or personal injury.",
      "Participants are responsible for their own devices.",
      "Teams must submit original work — plagiarism or pre-built projects are not allowed.",
      "The organizers reserve the right to disqualify teams for any form of misconduct.",
      "The decision of the judges will be final and binding.",
      "Participants are expected to adhere to the event's schedule and guidelines.",
    ],
  },
  {
    title: "Refund Policy",
    items: [
      "The registration fee is non-refundable.",
      "Refunds are considered only if the organizers cancel the event due to unforeseen circumstances.",
      "Refunds are also considered for technical issues preventing participation, once verified by the organizers.",
    ],
  },
  {
    title: "Code of Conduct",
    items: [
      "All participants are expected to behave respectfully and professionally.",
      "Harassment, discrimination, or any form of misconduct will not be tolerated and may result in disqualification and expulsion from the event.",
    ],
  },
]

export default function TermsPage() {
  return (
    <Section
      size="narrow"
      eyebrow="Legal"
      title="Terms & Conditions"
      description="Please read these before registering for any CICADA event."
    >
      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <ol className="mt-4 space-y-3">
              {section.items.map((item, index) => (
                <li key={item} className="flex gap-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-mono text-xs text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </Section>
  )
}
