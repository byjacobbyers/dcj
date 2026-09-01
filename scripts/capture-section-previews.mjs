/**
 * Capture /design/sections playgrounds into public/section-previews/*.png
 *
 * Requires a running site (pnpm dev) and Playwright Chromium.
 * Usage: node scripts/capture-section-previews.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const ORIGIN = process.env.SECTION_PREVIEW_ORIGIN || 'http://localhost:3000'
const OUT_DIR = path.join(process.cwd(), 'public', 'section-previews')

/** Design page hash id → Sanity schema type name */
const SECTIONS = [
  ['cover', 'coverBlock'],
  ['cover-video', 'coverVideo'],
  ['hero', 'heroBlock'],
  ['cta', 'ctaBlock'],
  ['text', 'textBlock'],
  ['image', 'imageBlock'],
  ['video', 'videoBlock'],
  ['gallery', 'galleryBlock'],
  ['faq', 'faqBlock'],
  ['split-scroll', 'splitScrollBlock'],
  ['problem', 'problemBlock'],
  ['cards', 'columnBlock'],
  ['form', 'formBlock'],
  ['embed', 'embedBlock'],
  ['spacer', 'spacerBlock'],
  ['divider', 'dividerBlock'],
  ['posts', 'postsBlock'],
  ['team', 'teamMemberBlock'],
]

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  })

  await page.goto(`${ORIGIN}/design/sections`, { waitUntil: 'load' })
  // Next.js HMR / analytics often prevent `networkidle`; settle briefly after load.
  await page.waitForTimeout(1200)

  // Clean catalog frames: no site chrome, cookie bar, or playground controls.
  // Force AppearAnimation content visible (whileInView can lag behind scroll).
  await page.addStyleTag({
    content: `
      header,
      [aria-labelledby="cookie-preferences-title"],
      [aria-label="Cookie consent"],
      .fixed.inset-x-0.bottom-0 {
        display: none !important;
      }
      .scroll-mt-24 > .border-y,
      .scroll-mt-24 > .border-b {
        display: none !important;
      }
      [style*="opacity"] {
        opacity: 1 !important;
        transform: none !important;
      }
    `,
  })

  for (const [anchorId, schemaType] of SECTIONS) {
    const root = page.locator(`#${anchorId}`)
    await root.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)

    await page.evaluate((id) => {
      const el = document.getElementById(id)
      if (!el) return
      el.querySelectorAll('[style]').forEach((node) => {
        const style = node
        if (style.style.opacity === '0' || style.style.opacity === '') {
          style.style.opacity = '1'
        }
        style.style.transform = 'none'
      })
    }, anchorId)

    const section = root.locator('section').first()
    const target = (await section.count()) > 0 ? section : root

    const box = await target.boundingBox()
    if (!box || box.height < 8) {
      console.warn(`skip ${schemaType}: empty box for #${anchorId}`)
      continue
    }

    const maxHeight = 480
    const clipHeight = Math.min(box.height, maxHeight)
    const buffer = await page.screenshot({
      type: 'png',
      clip: {
        x: Math.max(0, box.x),
        y: Math.max(0, box.y),
        width: Math.min(box.width, 1280),
        height: clipHeight,
      },
    })

    const outPath = path.join(OUT_DIR, `${schemaType}.png`)
    await writeFile(outPath, buffer)
    console.log(`wrote ${schemaType}.png (${Math.round(box.width)}×${Math.round(clipHeight)})`)
  }

  await browser.close()
  console.log('done')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
