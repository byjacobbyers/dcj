import EventsBlockServer from '@/components/events-block/server'
import { generateMetadata as generateSeoMetadata } from '@/lib/seo'

export const generateMetadata = async () =>
  generateSeoMetadata(
    undefined,
    undefined,
    'Events | Denver Contact Jam',
    'Workshops, series and special jams from Denver Contact Jam, in addition to the weekly Monday jam.',
    { url: '/events' }
  )

export default function EventsPage() {
  return (
    <article className="flex w-full flex-col items-center pt-8 pb-12">
      <EventsBlockServer componentIndex={0} title="Upcoming events" count={6} listMode="upcoming" />
    </article>
  )
}
