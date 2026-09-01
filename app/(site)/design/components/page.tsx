'use client'

import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

function GallerySection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="scroll-mt-20 border-t border-border py-10">
      <h2 className="mb-6 font-mono text-sm font-medium text-muted-foreground">{title}</h2>
      {children}
    </section>
  )
}

function VariantLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block font-mono text-xs text-muted-foreground">{children}</span>
}

export default function DesignComponentsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 pb-20">
      <h1 className="mb-2 text-h2 font-bold">Components</h1>
      <p className="mb-10 max-w-2xl text-body text-muted-foreground">
        Live UI primitives from <code className="font-mono text-sm">components/ui/</code>. Page-builder
        blocks live under <code className="font-mono text-sm">/design/sections</code>.
      </p>

      <GallerySection title="Button">
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <VariantLabel>default</VariantLabel>
            <Button variant="default">Primary</Button>
          </div>
          <div>
            <VariantLabel>secondary</VariantLabel>
            <Button variant="secondary">Secondary</Button>
          </div>
          <div>
            <VariantLabel>outline</VariantLabel>
            <Button variant="outline">Outline</Button>
          </div>
          <div>
            <VariantLabel>ghost</VariantLabel>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div>
            <VariantLabel>link</VariantLabel>
            <Button variant="link">Link</Button>
          </div>
          <div>
            <VariantLabel>destructive</VariantLabel>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div>
            <VariantLabel>huge</VariantLabel>
            <Button variant="huge">Huge CTA</Button>
          </div>
          <div>
            <VariantLabel>sm</VariantLabel>
            <Button size="sm">Small</Button>
          </div>
          <div>
            <VariantLabel>lg</VariantLabel>
            <Button size="lg">Large</Button>
          </div>
        </div>
      </GallerySection>

      <GallerySection title="Card">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Supporting description.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-body">Body content inside the card.</p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" size="sm">
              Action
            </Button>
          </CardFooter>
        </Card>
      </GallerySection>

      <GallerySection title="Input / Label / Textarea">
        <div className="flex max-w-md flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="design-email">Email</Label>
            <Input id="design-email" type="email" placeholder="you@example.com" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="design-message">Message</Label>
            <Textarea id="design-message" placeholder="Tell us a bit about yourself…" />
          </div>
        </div>
      </GallerySection>

      <GallerySection title="Switch">
        <div className="flex items-center gap-3">
          <Switch id="design-switch" defaultChecked />
          <Label htmlFor="design-switch">Send anonymously</Label>
        </div>
      </GallerySection>

      <GallerySection title="Accordion">
        <Accordion type="single" collapsible defaultValue="one">
          <AccordionItem value="one">
            <AccordionTrigger>First item</AccordionTrigger>
            <AccordionContent>
              Expanded content for the first accordion item — same scale as Input.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionTrigger>Second item</AccordionTrigger>
            <AccordionContent>
              Expanded content for the second accordion item.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </GallerySection>

      <GallerySection title="Navigation menu">
        <NavigationMenu>
          <NavigationMenuList>
            {['Home', 'Events', 'Posts'].map((label) => (
              <NavigationMenuItem key={label}>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/design/components">{label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </GallerySection>

      <GallerySection title="Tooltip">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </GallerySection>
    </main>
  )
}
