import { SanityDocument } from "next-sanity"
import Sections from "@/components/sections"

export default function Page({ page }: { page: SanityDocument }) {
  if (!page) return null
  const { sections = [], backgroundColor = 'primary' } = page
  const bgClass = backgroundColor === 'secondary' ? 'bg-primary text-primary-foreground' : ''
  return (
    <main className={`flex min-h-screen flex-col items-center ${bgClass}`}>
      <Sections body={sections} />
    </main>
  )
}
