import EventsBlockServer from '@/components/events-block/server'
import { generateMetadata as generateSeoMetadata } from '@/lib/seo'

export const generateMetadata = async () =>
  generateSeoMetadata(
    undefined,
    undefined,
    'Past events | Denver Contact Jam',
    'Workshops, series and special jams Denver Contact Jam has hosted.',
    { url: '/past-events' }
  )

export default function PastEventsPage() {
  return (
    <article className="flex w-full flex-col items-center pt-8 pb-12">
      <EventsBlockServer componentIndex={0} title="Past events" count={12} listMode="past" />
    </article>
  )
}
