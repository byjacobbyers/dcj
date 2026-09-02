import { defineField, defineType } from 'sanity'

/** Optional Event JSON-LD overrides (type stays Event; FAQ stays auto). */
export default defineType({
  name: 'eventJsonLd',
  title: 'Event JSON-LD',
  type: 'object',
  fields: [
    defineField({
      name: 'description',
      title: 'Description Override',
      type: 'text',
      rows: 3,
      description: 'Defaults to the SEO meta description.',
    }),
    defineField({
      name: 'eventStatus',
      title: 'Event Status',
      type: 'string',
      options: {
        list: [
          { title: 'Scheduled (default)', value: 'EventScheduled' },
          { title: 'Cancelled', value: 'EventCancelled' },
          { title: 'Postponed', value: 'EventPostponed' },
          { title: 'Rescheduled', value: 'EventRescheduled' },
          { title: 'Moved online', value: 'EventMovedOnline' },
        ],
      },
    }),
    defineField({
      name: 'eventAttendanceMode',
      title: 'Attendance Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Offline (default)', value: 'OfflineEventAttendanceMode' },
          { title: 'Online', value: 'OnlineEventAttendanceMode' },
          { title: 'Mixed', value: 'MixedEventAttendanceMode' },
        ],
      },
    }),
    defineField({
      name: 'organizerName',
      title: 'Organizer Name',
      type: 'string',
    }),
    defineField({
      name: 'organizerUrl',
      title: 'Organizer URL',
      type: 'url',
    }),
    defineField({
      name: 'offersUrl',
      title: 'Tickets / Offer URL',
      type: 'url',
    }),
    defineField({
      name: 'offersPrice',
      title: 'Offer Price',
      type: 'string',
      description: 'Numeric string, e.g. 0 or 49.00',
    }),
    defineField({
      name: 'offersPriceCurrency',
      title: 'Offer Currency',
      type: 'string',
      description: 'ISO currency, e.g. USD',
      initialValue: 'USD',
    }),
    defineField({
      name: 'offersAvailability',
      title: 'Offer Availability',
      type: 'string',
      options: {
        list: [
          { title: 'In stock', value: 'InStock' },
          { title: 'Sold out', value: 'SoldOut' },
          { title: 'Pre-order', value: 'PreOrder' },
        ],
      },
    }),
  ],
})
