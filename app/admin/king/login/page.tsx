import type { Metadata } from "next"
import { LoginForm } from "@/components/admin/login-form"
import { isAuthConfigured } from "@/lib/auth/config"

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="eyebrow">CICADA</p>
          <h1 className="mt-3 text-2xl font-semibold">Admin sign in</h1>
        </div>

        {isAuthConfigured() ? (
          <LoginForm next={next} />
        ) : (
          <div className="surface p-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Auth is not configured</p>
            <p className="mt-2 leading-relaxed">
              Set <code className="font-mono text-primary">ADMIN_SESSION_SECRET</code> and at least
              one <code className="font-mono text-primary">ADMIN_USER_*</code> variable, then
              redeploy.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
