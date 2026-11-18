import { Award, Lightbulb, Target, Users } from "lucide-react"

const takeaways = [
  {
    icon: Target,
    title: "Hands-on Experience",
    body: "Practical learning through real challenges",
  },
  {
    icon: Lightbulb,
    title: "Skill Development",
    body: "Enhance your technical capabilities",
  },
  { icon: Users, title: "Networking", body: "Connect with like-minded peers" },
  { icon: Award, title: "Recognition", body: "Certificates and prizes for winners" },
]

export function EventTakeaways() {
  return (
    <div className="surface p-6">
      <h2 className="text-base font-semibold">What you&apos;ll gain</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {takeaways.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" aria-hidden />
            </span>
            <div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const requirements = ["Team registration completed before deadline"]

export function EventRequirements() {
  return (
    <div className="surface p-6">
      <h2 className="text-base font-semibold">Requirements</h2>
      <ul className="mt-4 space-y-2.5">
        {requirements.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-muted-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
