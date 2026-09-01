import AppearAnimation from '@/components/appear-animation'
import SanityImage from '@/components/sanity-image'
import SimpleText from '@/components/simple-text'
import { GitHubIcon, LinkedInIcon, XIcon } from '@/components/social-icons'
import {
  normalizeSectionBackground,
  sectionSemanticSurfaceClasses,
  sectionSurfaceAttrs,
} from '@/lib/section-background'
import { sectionPaddingToClass } from '@/lib/section-padding'
import { cn } from '@/lib/utils'
import type { TeamMemberBlockProps } from '@/types/components/team-member-block-type'
import type { SanityImageSource } from '@/types/components/sanity-image-type'

const SOCIAL_ICONS = {
  linkedin: { label: 'LinkedIn', Icon: LinkedInIcon },
  github: { label: 'GitHub', Icon: GitHubIcon },
  x: { label: 'X', Icon: XIcon },
} as const

const SOCIAL_TEXT = [
  ['instagram', 'Instagram'],
  ['youtube', 'YouTube'],
  ['tiktok', 'TikTok'],
  ['facebook', 'Facebook'],
] as const

const iconButtonClass =
  'flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none'

export default function TeamMemberBlock({
  active = true,
  componentIndex = 0,
  anchor,
  sectionPadding,
  backgroundColor,
  member,
}: TeamMemberBlockProps) {
  if (active === false || !member?.title) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const sectionId = anchor || member.slug || `team-member-${componentIndex}`
  const jobLine = [member.primaryJobTitle, member.secondaryJobTitle]
    .filter(Boolean)
    .join(' · ')

  const iconLinks = (
    Object.keys(SOCIAL_ICONS) as Array<keyof typeof SOCIAL_ICONS>
  ).flatMap((key) => {
    const href = member.socials?.[key]
    if (typeof href !== 'string' || !href.trim()) return []
    const { label, Icon } = SOCIAL_ICONS[key]
    return [{ key, label, href: href.trim(), Icon }]
  })

  const textLinks = SOCIAL_TEXT.flatMap(([key, label]) => {
    const href = member.socials?.[key]
    return typeof href === 'string' && href.trim()
      ? [{ key, label, href: href.trim() }]
      : []
  })

  const hasContacts = Boolean(member.email) || iconLinks.length > 0 || textLinks.length > 0

  return (
    <section
      id={sectionId}
      data-background-color={bg}
      {...sectionSurfaceAttrs(bg)}
      className={cn(
        'team-member-block w-full flex justify-center px-5',
        sectionSemanticSurfaceClasses(bg),
        sectionPaddingToClass(sectionPadding, 'default')
      )}
    >
      <AppearAnimation
        className={cn(
          'container grid items-center gap-10',
          member.image ? 'md:grid-cols-[minmax(0,14rem)_1fr]' : undefined
        )}
      >
        {member.image ? (
          <div className="relative mx-auto aspect-square w-full max-w-56 overflow-hidden rounded-md bg-muted">
            <SanityImage
              image={member.image as SanityImageSource}
              fill
              sizes="224px"
              className="object-cover object-center"
            />
          </div>
        ) : null}
        <div className="flex flex-col gap-4 text-left">
          <div className="content">
            <h2 className="mb-0">{member.title}</h2>
            {jobLine ? (
              <p className="mt-3 text-lg text-muted-foreground">{jobLine}</p>
            ) : null}
            {member.content ? <SimpleText content={member.content} /> : null}
          </div>
          {hasContacts ? (
            <ul className="flex list-none flex-wrap items-center gap-2 p-0">
              {member.email ? (
                <li>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-sm text-primary no-underline hover:no-underline"
                  >
                    {member.email}
                  </a>
                </li>
              ) : null}
              {iconLinks.map(({ key, label, href, Icon }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={iconButtonClass}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
              {textLinks.map(({ key, label, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-1 text-sm text-primary no-underline hover:no-underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </AppearAnimation>
    </section>
  )
}
