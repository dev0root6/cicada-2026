import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, getSessionSecret } from "@/lib/auth/config"
import { verifySession } from "@/lib/auth/crypto"

/**
 * Hides the admin area behind a secret path segment.
 *
 * Anything under /admin that is not the real entry point is answered with an
 * identical, permanently-loading page. Serving it from here rather than from a
 * React route matters: a rendered page would carry the framework's RSC payload,
 * which embeds the requested path and route metadata, so /admin and
 * /admin/<guess> would differ byte-for-byte and let someone probe the shape of
 * the routing tree. This response is the same bytes every time.
 *
 * Notably there is no redirect anywhere: a Location header pointing at a login
 * URL would hand out the secret to the first person who typed /admin.
 *
 * The secret is the path. Everything behind it is still authenticated
 * independently — this only stops the door being found.
 */

const ADMIN_ROOT = "/admin"
const ADMIN_ENTRY = "/admin/king"

/** Deliberately anonymous: no product name, no copy, no links, no error text. */
const DECOY = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Loading</title><style>html,body{margin:0;height:100%;background:#0a0a0a}.w{display:flex;align-items:center;justify-content:center;height:100%}.s{width:28px;height:28px;border:2px solid rgba(255,255,255,.15);border-top-color:rgba(255,255,255,.55);border-radius:50%;animation:s .9s linear infinite}@keyframes s{to{transform:rotate(360deg)}}</style></head><body><div class="w"><div class="s" role="status" aria-label="Loading"></div></div></body></html>`

function decoy() {
  return new NextResponse(DECOY, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  })
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname !== ADMIN_ROOT && !pathname.startsWith(`${ADMIN_ROOT}/`)) {
    return NextResponse.next()
  }

  // Anything outside the secret path is the decoy, session or not — /admin
  // itself has no route behind it, and a signed-in admin should see exactly
  // what a stranger sees rather than the site's own 404.
  const underEntry = pathname === ADMIN_ENTRY || pathname.startsWith(`${ADMIN_ENTRY}/`)
  if (!underEntry) return decoy()

  // The sign-in screen itself. Always rendered, so the secret path behaves the
  // same whether or not the visitor happens to hold a session.
  if (pathname === ADMIN_ENTRY) return pass()

  // Sub-paths need a session. Without one they get the same decoy as a wrong
  // guess, so /admin/king/export and /admin/wrong/export are indistinguishable
  // and probing sub-paths cannot reveal the secret segment.
  const secret = getSessionSecret()
  const session = secret
    ? await verifySession(request.cookies.get(SESSION_COOKIE)?.value, secret)
    : null

  if (!session) return decoy()

  return pass()
}

function pass() {
  const response = NextResponse.next()
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive")
  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}
