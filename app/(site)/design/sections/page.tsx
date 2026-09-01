import {
  ColumnPlayground,
  CoverPlayground,
  CoverVideoPlayground,
  CtaPlayground,
  DividerPlayground,
  EmbedPlayground,
  FaqPlayground,
  FormPlayground,
  GalleryPlayground,
  HeroPlayground,
  ImagePlayground,
  PostsPlayground,
  SpacerPlayground,
  SplitScrollPlayground,
  TeamPlayground,
  TextPlayground,
  VideoPlayground,
} from './playgrounds'

const NAV = [
  { href: '#cover', label: 'Cover' },
  { href: '#cover-video', label: 'Cover video' },
  { href: '#hero', label: 'Hero' },
  { href: '#cta', label: 'CTA' },
  { href: '#text', label: 'Text' },
  { href: '#image', label: 'Image' },
  { href: '#video', label: 'Video' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#faq', label: 'FAQ' },
  { href: '#split-scroll', label: 'Split scroll' },
  { href: '#cards', label: 'Columns' },
  { href: '#form', label: 'Form' },
  { href: '#embed', label: 'Embed' },
  { href: '#spacer', label: 'Spacer' },
  { href: '#divider', label: 'Divider' },
  { href: '#posts', label: 'Posts' },
  { href: '#team', label: 'Team' },
] as const

export default function DesignSectionsPage() {
  return (
    <div className="pb-20">
      <header className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-2 text-h2 font-bold">Sections</h1>
        <p className="mb-6 max-w-2xl text-body text-muted-foreground">
          Live page-builder blocks with fixture props. Use the control strips to toggle high-value
          variants (background, layout, height, and more). Media slots use wireframe placeholders.
        </p>
        <nav aria-label="Section anchors" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-muted-foreground no-underline hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <CoverPlayground />
      <CoverVideoPlayground />
      <HeroPlayground />
      <CtaPlayground />
      <TextPlayground />
      <ImagePlayground />
      <VideoPlayground />
      <GalleryPlayground />
      <FaqPlayground />
      <SplitScrollPlayground />
      <ColumnPlayground />
      <FormPlayground />
      <EmbedPlayground />
      <SpacerPlayground />
      <DividerPlayground />
      <PostsPlayground />
      <TeamPlayground />
    </div>
  )
}
