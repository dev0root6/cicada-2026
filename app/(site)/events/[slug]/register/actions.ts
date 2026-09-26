"use server"

import { after } from "next/server"
import { isDatabaseConfigured } from "@/lib/db/client"
import { addRegistrationInterest } from "@/lib/db/interest"
import { requestOrigin } from "@/lib/mail/origin"
import { sendSignupConfirmation } from "@/lib/mail/send"
import { events } from "@/data/events"

export type NotifyState = {
  status?: "success" | "error"
  message?: string
  /** Echoed back so a failed attempt doesn't clear the field. */
  email?: string
}

export async function requestNotification(
  eventSlug: string,
  _prev: NotifyState,
  formData: FormData,
): Promise<NotifyState> {
  // Honeypot: real visitors never see or fill this field.
  if (formData.get("company")) return { status: "success" }

  const event = events.find((e) => e.slug === eventSlug)
  if (!event) return { status: "error", message: "This event no longer exists." }

  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) {
    return { status: "error", message: "Please enter a valid email address.", email }
  }

  if (!isDatabaseConfigured()) {
    return {
      status: "error",
      message: "Sign-ups are unavailable right now. Please try again later.",
      email,
    }
  }

  try {
    const isNew = await addRegistrationInterest(event.slug, email)
    // Confirm by email after the response is sent, so the visitor never waits
    // on Gmail. Repeat sign-ups don't get a second copy.
    if (isNew) {
      const origin = await requestOrigin()
      after(() => sendSignupConfirmation(event, email, origin))
    }
  } catch (error) {
    console.error("registration interest failed", error)
    return { status: "error", message: "Something went wrong. Please try again.", email }
  }

  return { status: "success" }
}
