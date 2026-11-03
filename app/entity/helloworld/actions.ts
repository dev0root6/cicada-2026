"use server"

import { after } from "next/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { isDatabaseConfigured } from "@/lib/db/client"
import { destroyEntity } from "@/lib/db/flags"
import { canKill, canSignIn, credentialsMatch, grantKill, isSignedIn, startSession } from "@/lib/entity/auth"
import { isSolved } from "@/lib/entity/puzzle"
import { fromAddress, getTransport, isMailConfigured } from "@/lib/mail/transport"

export type LoginState = { error?: string; attempts?: number; ok?: boolean }

export async function signInAction(previous: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").slice(0, 80)
  const password = String(formData.get("password") ?? "").slice(0, 120)
  const attempts = (previous.attempts ?? 0) + 1
  if (!canSignIn()) return { error: "The console is offline. Try again later.", attempts }
  if (!username || !password || !(await credentialsMatch(username, password))) {
    // A small, fixed delay keeps guessing slow without punishing a typo much.
    await new Promise((r) => setTimeout(r, 700))
    return { error: "Access denied. Wrong operator or passphrase.", attempts }
  }
  await startSession()
  return { ok: true, attempts }
}

/** Re-checks the relay on the server; only a real route unlocks the turn-off button. */
export async function submitRouteAction(rotations: number[]): Promise<{ ok: boolean; error?: string }> {
  if (!(await isSignedIn())) return { ok: false, error: "Session expired. Sign in again." }
  if (!isSolved(rotations)) return { ok: false, error: "The signal doesn't reach the core yet." }
  await grantKill()
  return { ok: true }
}

export type ShutdownState = { error?: string; late?: boolean; email?: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function shutdownAction(_previous: ShutdownState, formData: FormData): Promise<ShutdownState> {
  if (!(await isSignedIn())) return { error: "Session expired. Sign in again." }
  if (!(await canKill())) return { error: "Route the kill signal to the core first." }
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  if (email.length > 200 || !EMAIL.test(email)) return { error: "Enter a valid email so we know who you are.", email }
  if (!isDatabaseConfigured()) return { error: "The core is unreachable right now. Try again in a minute.", email }

  let won = false
  try {
    won = await destroyEntity(email)
  } catch (error) {
    console.error("entity shutdown failed", error)
    return { error: "The core is unreachable right now. Try again in a minute.", email }
  }
  if (!won) return { late: true }

  revalidatePath("/entity")
  revalidatePath("/entity/helloworld")
  revalidatePath("/admin/king/system")
  after(() => notifyCrew(email))
  redirect("/home")
}

/** Lets the organisers know who got there first. Never blocks the winner. */
async function notifyCrew(email: string) {
  if (!isMailConfigured()) return
  try {
    const to = process.env.MAIL_USER?.trim()
    if (!to) return
    await getTransport().sendMail({
      from: fromAddress(),
      to,
      subject: "Entity destroyed: /entity/helloworld",
      text: `Someone pressed the emergency turn-off.\n\nEmail: ${email}\nTime: ${new Date().toISOString()}\n\nSee /admin/king/system for the status.`,
    })
  } catch (error) {
    console.error("entity notify failed", error)
  }
}
