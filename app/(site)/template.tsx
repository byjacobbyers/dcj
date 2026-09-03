import { cn } from "@/lib/utils";

// CSS animation, not framer-motion: the motion version shipped opacity:0 in
// the server HTML, hiding the whole page until hydration and gating LCP on
// the JS bundle. Next still remounts templates per navigation, so the fade
// replays on client-side route changes exactly as before.
export default function Template({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('page-fade-in flex min-h-0 min-w-0 flex-1 flex-col', className)}>
      {children}
    </div>
  );
}
