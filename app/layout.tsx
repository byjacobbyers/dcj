import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Denver Contact Jam",
  description: "Denver Contact Jam",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
