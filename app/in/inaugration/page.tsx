import type { Metadata } from "next"

import { getCeremony } from "@/lib/db/inauguration"
import { isAdminProtected } from "@/lib/inauguration/auth"
import { AdminConsole } from "./console"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Inauguration console",
  robots: { index: false, follow: false },
}

/**
 * The run-the-ceremony console.
 *
 * Spelled "inaugration" because that is the URL that was asked for and the one
 * printed on the run sheet; renaming it later would break a link people have
 * already been given.
 */
export default async function InaugurationAdminPage() {
  const state = await getCeremony()
  return <AdminConsole initial={state} protectedByKey={isAdminProtected()} />
}
