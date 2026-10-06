import Image from 'next/image'

import PageBackdrop from '@/components/page-backdrop'
import { Card, CardContent } from '@/components/ui/card'
import { parseVersionDate } from '@/lib/signin'
import type { SignInSettingsQueryResult } from '@/sanity.types'
import { sanityFetch } from '@/sanity/lib/live'
import { SignInSettingsQuery } from '@/sanity/queries/documents/sign-in-query'
import SignInForm from './sign-in-form'

const VENMO_HANDLE = 'Wiggelruhm'

export const metadata = {
  robots: { index: false, follow: false },
}

export default async function SignInPage() {
  const { data } = await sanityFetch({ query: SignInSettingsQuery, stega: false })
  const settings = data as SignInSettingsQueryResult
  const guidelinesVersion = parseVersionDate(settings?.guidelinesVersion)

  return (
    <div className="relative flex w-full min-h-0 flex-1 flex-col items-center overflow-hidden text-foreground">
      <PageBackdrop />
      <main className="relative z-10 w-full" data-background-color="silk">
        <section className="w-full px-5 py-16 md:py-24">
          <div className="container mx-auto flex flex-col items-center">
            <div className="w-full max-w-3xl space-y-8 lg:max-w-6xl">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
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

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
                <SignInForm guidelinesVersion={guidelinesVersion} />

                {/* venmo-qr.svg encodes https://www.venmo.com/u/Wiggelruhm; regenerate it if the handle changes. */}
                <Card className="shadow-lg lg:sticky lg:top-24">
                  <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                    <p className="text-xl font-medium 2xl:text-2xl">Pay with Venmo</p>
                    <div className="rounded-lg bg-white p-3">
                      <Image
                        src="/venmo-qr.svg"
                        alt={`QR code for Venmo @${VENMO_HANDLE}`}
                        width={208}
                        height={208}
                        unoptimized
                      />
                    </div>
                    <p className="text-lg text-muted-foreground 2xl:text-xl">@{VENMO_HANDLE}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
