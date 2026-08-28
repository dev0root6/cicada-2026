import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, getSessionSecret } from "@/lib/auth/config"
import { verifySession } from "@/lib/auth/crypto"

const LOGIN_PATH = "/admin/king/login"

/**
 * Gates everything under /admin. This runs on the Edge runtime, so it only
 * verifies the session HMAC — password hashing stays in the Node-side action.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (pathname === LOGIN_PATH) return NextResponse.next()

  const secret = getSessionSecret()
  // With no secret configured no session can be valid, so fail closed.
  const session = secret
    ? await verifySession(request.cookies.get(SESSION_COOKIE)?.value, secret)
    : null

  if (session) return NextResponse.next()

  const login = request.nextUrl.clone()
  login.pathname = LOGIN_PATH
  login.search = ""
  // Preserve where they were headed so login can bounce them back.
  if (pathname !== "/admin/king") login.searchParams.set("next", `${pathname}${search}`)

  const response = NextResponse.redirect(login)
  // Clear a token that failed verification so it is not retried on every request.
  response.cookies.delete(SESSION_COOKIE)
  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}
