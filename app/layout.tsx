import type { Metadata } from "next"
import GoogleAnalyticsScripts from "@/components/google-analytics"

export const metadata: Metadata = {
  title: "Denver Contact Jam",
  description: "Denver Contact Jam",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        <GoogleAnalyticsScripts />
        {children}
      </body>
    </html>
  )
}
