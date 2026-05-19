import Script from 'next/script'
import { gaMeasurementId } from '@/lib/analytics'

/** Standard GA4 gtag.js install (matches Google Analytics setup snippet). */
export default function GoogleAnalyticsScripts() {
  if (!gaMeasurementId) return null

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy="beforeInteractive"
      />
      <Script id="google-analytics" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaMeasurementId}');
        `}
      </Script>
    </>
  )
}
