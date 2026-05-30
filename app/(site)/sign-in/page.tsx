import PageBackdrop from '@/components/page-backdrop'
import SignInForm from './sign-in-form'

export const metadata = {
  robots: { index: false, follow: false },
}

export default function SignInPage() {
  return (
    <div className="relative flex w-full min-h-0 flex-1 flex-col items-center overflow-hidden text-foreground">
      <PageBackdrop />
      <main className="relative z-10 w-full" data-background-color="silk">
        <section className="w-full px-5 py-16 md:py-24">
          <div className="container mx-auto flex flex-col items-center">
            <div className="w-full max-w-3xl space-y-8">
              <div className="space-y-4 text-center">
                <p className="text-lg font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Denver Contact Jam
                </p>
                <h1 className="font-heading text-h1 text-foreground">
                  Jam Sign-In
                </h1>
                <p className="mx-auto max-w-2xl text-xl text-muted-foreground 2xl:text-2xl">
                  Please sign in before joining the jam. We use this to track attendance
                  and keep contact information current.
                </p>
              </div>

              <SignInForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
