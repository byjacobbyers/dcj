import type { Metadata } from "next"
import { GoogleTagManager } from "@next/third-parties/google"
import { gtmId } from "@/lib/analytics"
import { heading, mono, sans } from "./fonts"
import { cn } from "@/lib/utils"
import "./globals.css"
import Template from "./template"
import { sanityFetch, SanityLive } from "@/sanity/lib/live"
import { SiteQuery } from "@/sanity/queries/documents/site-query"
import { AnnouncementQuery } from "@/sanity/queries/documents/announcement-query"
import { headerQuery, footerQuery } from "@/sanity/queries/components/page-nav-query"
import { PreviewBar } from "@/components/preview-bar"
import { VisualEditing } from "next-sanity/visual-editing"
import { draftMode } from "next/headers"
import AnnouncementBar from "@/components/announcement"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SmoothScrollProvider from "@/components/providers/smooth-scroll-provider"
import { Providers } from "@/components/providers"
import OrganizationJsonLd from "@/components/organization-jsonld"
import type { AnnouncementType } from "@/types/documents/announcement-type"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Denver Contact Jam",
  description: "Denver Contact Jam",
}

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isEnabled } = await draftMode()

  const now = new Date()
  const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

  const { site, headerNav, footerNav } = await (async () => {
    try {
      const [siteRes, headerRes, footerRes] = await Promise.all([
        sanityFetch({ query: SiteQuery }),
        sanityFetch({ query: headerQuery }),
        sanityFetch({ query: footerQuery }),
      ])
      return {
        site: siteRes.data,
        headerNav: headerRes.data,
        footerNav: footerRes.data,
      }
    } catch {
      return { site: null, headerNav: null, footerNav: null }
    }
  })()

  let announcement: AnnouncementType | null = null
  try {
    const announcementRes = await sanityFetch({
      query: AnnouncementQuery,
      params: { today: todayLocal },
    })
    announcement = announcementRes.data
  } catch {
    announcement = null
  }

  return (
    <div
      className={cn(
        heading.variable,
        sans.variable,
        mono.variable,
        'flex min-h-screen flex-col antialiased bg-background text-foreground font-sans',
        isEnabled && 'body-preview-mode',
      )}
    >
      <svg aria-hidden className="absolute w-0 h-0 overflow-hidden">
        <defs>
          <filter id="advanced-texture">
            <feTurbulence result="noise" numOctaves="3" baseFrequency="0.7" type="fractalNoise" />
            <feSpecularLighting result="specular" lightingColor="white" specularExponent="20" specularConstant="0.8" surfaceScale="2" in="noise">
              <fePointLight z="100" y="50" x="50" />
            </feSpecularLighting>
            <feComposite result="litNoise" operator="in" in2="SourceGraphic" in="specular" />
            <feBlend mode="overlay" in2="litNoise" in="SourceGraphic" />
          </filter>
        </defs>
      </svg>
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      <Providers>
        {site && <OrganizationJsonLd site={site} />}
        {isEnabled && <PreviewBar />}
        <SmoothScrollProvider>
          <div className="flex flex-col gap-2 z-40">
            <AnnouncementBar announcement={announcement} />
          </div>
          <div className="sticky top-0 z-50 flex shrink-0 flex-col">
            <Header navigation={headerNav} />
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <Template>
              {children}
              <SanityLive />
              {isEnabled && <VisualEditing zIndex={999999} />}
            </Template>
          </div>
          <div className="z-50 flex shrink-0 flex-col">
            <Footer navigation={footerNav} />
          </div>
        </SmoothScrollProvider>
      </Providers>
    </div>
  )
}
