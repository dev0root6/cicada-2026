import "server-only"
import { getSql } from "./client"

/**
 * Records a request to be told when an event's registrations open. Repeat
 * sign-ups are a no-op, so the caller can't tell whether an email was already
 * on the list.
 */
export async function addRegistrationInterest(eventSlug: string, email: string): Promise<void> {
  const sql = getSql()
  await sql`
    insert into registration_interest (event_slug, email)
    values (${eventSlug}, ${email})
    on conflict (event_slug, lower(email)) do nothing
  `
}
