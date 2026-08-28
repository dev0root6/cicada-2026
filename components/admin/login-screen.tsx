import { LoginForm } from "./login-form"

/** Sign-in, rendered in place at /admin/king when there is no session. */
export function LoginScreen({ configured }: { configured: boolean }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="eyebrow">CICADA</p>
          <h1 className="mt-3 text-2xl font-semibold">Admin sign in</h1>
        </div>

        {configured ? (
          <LoginForm />
        ) : (
          <div className="surface p-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Auth is not configured</p>
            <p className="mt-2 leading-relaxed">
              Set <code className="font-mono text-primary">ADMIN_SESSION_SECRET</code> and at least
              one <code className="font-mono text-primary">ADMIN_USER_*</code> variable in your
              hosting environment, then redeploy.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
