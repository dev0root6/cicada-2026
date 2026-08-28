import "server-only"
import { getSql, type Row } from "./client"

export type AdminRole = "admin" | "manager"

export type AdminUser = {
  id: number
  username: string
  role: AdminRole
  createdBy: string | null
  createdAt: string
  disabledAt: string | null
  /** Events this manager is responsible for. Empty for admins, who span all. */
  events: string[]
}

function toUser(row: Row): AdminUser {
  return {
    id: Number(row.id),
    username: String(row.username),
    role: row.role as AdminRole,
    createdBy: (row.created_by as string | null) ?? null,
    createdAt: new Date(row.created_at as string).toISOString(),
    disabledAt: row.disabled_at ? new Date(row.disabled_at as string).toISOString() : null,
    events: (row.events as string[] | null) ?? [],
  }
}

/** Sign-in lookup. Only active accounts; disabled ones behave as non-existent. */
export async function findActiveUser(
  username: string,
): Promise<{ user: AdminUser; passwordDigest: string } | null> {
  const sql = getSql()
  const rows = await sql`
    select u.*,
           coalesce(array_agg(e.event_slug) filter (where e.event_slug is not null), '{}') as events
      from admin_users u
      left join admin_user_events e on e.user_id = u.id
     where u.username = ${username.toLowerCase()}
       and u.disabled_at is null
     group by u.id
  `
  if (!rows.length) return null
  return { user: toUser(rows[0]), passwordDigest: String(rows[0].password_digest) }
}

export async function listUsers(): Promise<AdminUser[]> {
  const sql = getSql()
  const rows = await sql`
    select u.*,
           coalesce(array_agg(e.event_slug) filter (where e.event_slug is not null), '{}') as events
      from admin_users u
      left join admin_user_events e on e.user_id = u.id
     group by u.id
     order by u.disabled_at nulls first, u.created_at desc
  `
  return rows.map(toUser)
}

export async function createUser(input: {
  username: string
  passwordDigest: string
  role: AdminRole
  events: string[]
  createdBy: string
}): Promise<AdminUser> {
  const sql = getSql()
  const rows = await sql`
    insert into admin_users (username, password_digest, role, created_by)
    values (${input.username.toLowerCase()}, ${input.passwordDigest}, ${input.role}, ${input.createdBy})
    returning *
  `
  const id = Number(rows[0].id)

  // Admins span every event, so their scope is not stored as rows.
  if (input.role === "manager" && input.events.length) {
    for (const slug of input.events) {
      await sql`
        insert into admin_user_events (user_id, event_slug)
        values (${id}, ${slug})
        on conflict do nothing
      `
    }
  }

  return { ...toUser(rows[0]), events: input.role === "manager" ? input.events : [] }
}

export async function setUserDisabled(id: number, disabled: boolean): Promise<void> {
  const sql = getSql()
  await sql`
    update admin_users
       set disabled_at = ${disabled ? new Date().toISOString() : null}
     where id = ${id}
  `
}

export async function setUserEvents(id: number, events: string[]): Promise<void> {
  const sql = getSql()
  await sql`delete from admin_user_events where user_id = ${id}`
  for (const slug of events) {
    await sql`
      insert into admin_user_events (user_id, event_slug)
      values (${id}, ${slug})
      on conflict do nothing
    `
  }
}

export async function setUserPassword(id: number, passwordDigest: string): Promise<void> {
  const sql = getSql()
  await sql`update admin_users set password_digest = ${passwordDigest} where id = ${id}`
}
