import { site } from "./site"

export type FaqItem = {
  question: string
  answer: string
}

/**
 * Answers reference `site` rather than naming the edition inline, so rolling
 * the fest forward stays a one-line change in data/site.ts.
 */
export const faqs: FaqItem[] = [
  {
    question: `What is ${site.title}?`,
    answer: `${site.title} is ${site.venue.name}'s premier annual technology festival featuring workshops, hackathons, competitions, tech talks, and showcases across AI, Robotics, Cybersecurity, Design, and Development. It's a three-day celebration of innovation and learning by building.`,
  },
  {
    question: "Who can participate?",
    answer: "Open to all Atrians and non-Atrians.",
  },
  {
    question: "How do I register for events?",
    answer:
      "Visit the Events page, browse available events, and click the Register button on any event you're interested in. Teams can register together or add members later according to event rules.",
  },
  {
    question: "Are there prizes and mentorship?",
    answer:
      "Yes! Most events offer exciting prizes, mentorship opportunities, and recognition. We have prize tracks across different categories, cash prizes, and certificates.",
  },
  {
    question: `When and where is ${site.title}?`,
    answer: `${site.title} runs from ${site.dates} at ${site.venue.name} in ${site.venue.city}, 8:30 AM to 5:30 PM each day. Project Expo and the IPL Auction are on 19 November, E-Sports and the start of the Hackathon on 20 November, and the Hackathon finishes on 21 November.`,
  },
  {
    question: "Is accommodation provided for participants?",
    answer:
      "No, accommodation will not be provided for participants. We recommend arranging your own accommodation in advance. The event venue is well-connected to various parts of Bengaluru via public transport and cabs.",
  },
]
