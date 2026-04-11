import { Inter } from "next/font/google";

// `globals.css` defines the font stacks via CSS variables (e.g. `--font-sans: Inter, ...`).
// Here we load Inter so the `--font-sans` variable points to the actual webfont.
export const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

// For serif/mono, `globals.css` uses system stacks (`ui-serif`, `ui-monospace`).
// Avoid overriding them here so the styling stays consistent with `globals.css`.
export const serif = { variable: "" } as const;
export const mono = { variable: "" } as const;
