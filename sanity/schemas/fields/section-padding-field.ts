import { defineField } from 'sanity'
import SectionPaddingInput from '../inputs/section-padding-input'

export const SECTION_PADDING_VALUES = ['none', 'tiny', 'small', 'default'] as const
export type SectionPaddingSchemaValue = (typeof SECTION_PADDING_VALUES)[number]

export function sectionPaddingField(opts?: {
  initialValue?: SectionPaddingSchemaValue
  /** Sanity field group (e.g. video block "general") */
  group?: string
}) {
  return defineField({
    title: 'Section padding',
    name: 'sectionPadding',
    type: 'string',
    description: 'Vertical padding above and below this section (Tailwind py-*)',
    initialValue: opts?.initialValue ?? 'default',
    ...(opts?.group ? { group: opts.group } : {}),
    options: {
      list: [
        { title: 'None (0)', value: 'none' },
        { title: 'Tiny', value: 'tiny' },
        { title: 'Small', value: 'small' },
        { title: 'Default', value: 'default' },
      ],
    },
    components: {
      input: SectionPaddingInput,
    },
    validation: (Rule) =>
      Rule.custom((val) => {
        if (val == null || val === '') return true
        if (!SECTION_PADDING_VALUES.includes(val as SectionPaddingSchemaValue)) {
          return 'Invalid padding preset'
        }
        return true
      }),
  })
}
