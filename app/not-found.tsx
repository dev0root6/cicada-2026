import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-3xl font-semibold md:text-5xl">This page moved on</h1>
      <p className="mt-4 max-w-sm text-muted-foreground">
        The page you were looking for isn&apos;t here. The line-up is still where you left it.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/events">Browse events</Link>
        </Button>
      </div>
    </div>
  )
}
