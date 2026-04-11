import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

type FontSizeConfig = {
  fontSize: string
  lineHeight?: string
  letterSpacing?: string
  fontWeight?: string | number
}

const TYPE_SCALE: Record<string, FontSizeConfig> = {
  display: {
    fontSize: "6rem",
    lineHeight: "1.06",
    letterSpacing: "-0.03em",
    fontWeight: 700,
  },
  h1: {
    fontSize: "4rem",
    lineHeight: "1.08",
    letterSpacing: "-0.025em",
    fontWeight: 700,
  },
  h2: {
    fontSize: "3.25rem",
    lineHeight: "1.12",
    letterSpacing: "-0.02em",
    fontWeight: 700,
  },
  h3: {
    fontSize: "2.75rem",
    lineHeight: "1.18",
    letterSpacing: "-0.015em",
    fontWeight: 600,
  },
  "body-lg": {
    fontSize: "2rem",
    lineHeight: "1.5",
    fontWeight: 400,
  },
  body: {
    fontSize: "1.25rem",
    lineHeight: "1.6",
    fontWeight: 400,
  },
  small: {
    fontSize: "1rem",
    lineHeight: "1.6",
    fontWeight: 400,
  },
}

const ORDERED_KEYS = ["display", "h1", "h2", "h3", "body-lg", "body", "small"] as const

export default function TypeScalePage() {
  const sample = "How vexingly quick daft zebras jump"

  return (
    <main className="px-4 py-8 max-w-5xl mx-auto">
      <h1 className="font-bold text-4xl mb-6">Tailwind Type Scale</h1>
      <p className="mb-8">
        This page is intentionally not crawlable. It shows the type scale behind utilities like{" "}
        <code>text-display</code>, <code>text-h1</code>, and <code>text-body</code>, matching the values defined in
        your <code>@theme</code> configuration in <code>globals.css</code>.
      </p>

      <div className="flex flex-col gap-6">
        {ORDERED_KEYS.map((key) => {
          const config = TYPE_SCALE[key]
          const metaParts: string[] = [
            `size: ${config.fontSize}`,
            config.lineHeight ? `lineHeight: ${config.lineHeight}` : "",
            config.letterSpacing ? `letterSpacing: ${config.letterSpacing}` : "",
            config.fontWeight !== undefined ? `fontWeight: ${String(config.fontWeight)}` : "",
          ].filter(Boolean)

          return (
            <section key={key} className="border rounded-lg p-4">
              <div className="flex flex-col gap-2 mb-3">
                <div className="text-xs opacity-80">
                  <span className="font-mono">{`text-${key}`}</span>
                </div>
                <div
                  className="font-serif"
                  style={{
                    fontSize: config.fontSize,
                    lineHeight: config.lineHeight,
                    letterSpacing: config.letterSpacing,
                    fontWeight: config.fontWeight,
                  }}
                >
                  {sample}
                </div>
              </div>

              <div className="text-sm opacity-80 font-mono">{metaParts.join(" | ")}</div>
            </section>
          )
        })}
      </div>

      <section className="mt-16 pt-16 border-t border-border">
        <h2 className="text-2xl font-bold mb-2">Example copy</h2>
        <p className="text-sm text-muted-foreground mb-10 ">
          Use this block to eyeball type changes after editing <code className="text-xs">@theme</code> in{" "}
          <code className="text-xs">globals.css</code>. The sample below uses no Tailwind utilities—only a{" "}
          <code className="text-xs">content</code> wrapper plus <code className="text-xs">.display</code> and{" "}
          <code className="text-xs">.lead</code> hooks (same as you’d wire from Portable Text)—so typography comes
          entirely from <code className="text-xs">globals.css</code>.
        </p>

        {/* No Tailwind on children — same shape as PortableText blocks inside NormalText (content + .display / .lead hooks only). */}
        <div className="content">
          <h1>Type Scale Preview</h1>
          <p>
            This example shows how your content styles render in context. The hero below uses the <code>.display</code>{" "}
            class for large headlines; this section uses a standard <code>h1</code>.
          </p>

          <h1 className="display">Marketing Moves Fast. Your Website Should Too.</h1>
          <p className="lead">
            High-performance websites that help B2B marketing teams launch campaigns, landing pages, and experiments
            without technical bottlenecks.
          </p>
          <p>
            <strong>Book an Intro Call</strong>
          </p>

          <h2>When the Website Becomes the Bottleneck</h2>
          <p>Marketing teams rely on their website to launch campaigns, publish content, and support growth.</p>
          <p>But as the site grows, the underlying website infrastructure often struggles to keep up.</p>
          <ul>
            <li>Landing pages take longer to launch.</li>
            <li>Simple updates require developer time.</li>
            <li>Performance and SEO issues begin to accumulate.</li>
          </ul>
          <p>What started as a simple website becomes a barrier to moving fast.</p>

          <blockquote>
            The website should never slow marketing down. That’s the principle we design around.
          </blockquote>

          <hr />

          <h2>The Technical Partner for Marketing Teams</h2>
          <h3>Built for Marketing Velocity</h3>
          <p>
            Marketing teams need to launch campaigns, landing pages, and experiments quickly. Denver Contact Jam designs and maintains
            web systems that allow marketing teams to ship quickly without technical bottlenecks.
          </p>
          <h3>Designed to Scale with Marketing</h3>
          <p>
            Modern websites must support performance, SEO, analytics, and evolving marketing needs. Denver Contact Jam builds composable
            systems using frameworks like Next.js and Sanity so the website can scale alongside marketing strategy.
          </p>
          <h3>Without a Full-Time Engineering Hire</h3>
          <p>
            Most companies don’t need a dedicated web engineering team for marketing. Denver Contact Jam partners with CMOs and
            marketing directors to provide senior technical support for the web layer when it matters most.
          </p>

          <h2>Trusted by Marketing Teams</h2>
          <h3>TerraTrue</h3>
          <p>Campaign development and website infrastructure for a fast-moving B2B team.</p>
          <h3>Unified</h3>
          <p>Modern marketing website architecture delivered in under a month.</p>
          <h3>Parcion Private Wealth</h3>
          <p>High-performance website supporting marketing and content growth.</p>

          <h2>A Simple Way to Get Started</h2>
          <small>Step 1</small>
          <h3>Discovery &amp; Assessment</h3>
          <p>
            Every engagement starts with understanding the current website, marketing goals, and technical constraints.
          </p>
          <p>This ensures the right improvements are prioritized from the beginning.</p>
          <small>Step 2</small>
          <h3>Design &amp; Implementation</h3>
          <p>
            Denver Contact Jam designs or improves the web infrastructure needed to support marketing campaigns, landing pages, and
            growth initiatives.
          </p>
          <p>This may include rebuilding parts of the site, improving performance, or modernizing the CMS.</p>
          <small>Step 3</small>
          <h3>Ongoing Technical Partnership</h3>
          <p>
            Marketing teams continue working with Denver Contact Jam to support new campaigns, performance improvements, and evolving
            marketing needs.
          </p>
          <p>The goal is simple: ensure the website never slows marketing down.</p>
          <h2>Start with a Short Conversation</h2>
          <p>If your website is slowing down marketing initiatives, let’s talk.</p>
          <p>
            We’ll review your current setup, identify bottlenecks, and see whether working together makes sense.
          </p>
          <p>If it’s not a fit, you’ll still walk away with a clearer understanding of your options.</p>
          <p>
            <strong>Schedule an Intro Call</strong>
          </p>
          <p>
            You can use <code>text-display</code> for hero headlines and <mark>highlight</mark> for emphasis.
          </p>
        </div>
      </section>
    </main>
  )
}

