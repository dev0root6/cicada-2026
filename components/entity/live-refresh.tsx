"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useEntityStatus } from "./live"

/** Re-renders a server page as soon as the entity is destroyed. */
export function LiveRefresh({ destroyed }: { destroyed: boolean }) {
  const router = useRouter()
  const now = useEntityStatus(destroyed)
  useEffect(() => {
    if (now && !destroyed) router.refresh()
  }, [now, destroyed, router])
  return null
}
