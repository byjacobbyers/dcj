declare module "tailwindcss/resolveConfig" {
  import type { Config } from "tailwindcss"

  /**
   * Resolves a Tailwind configuration object (merging with defaults)
   * and returns the fully-expanded config.
   */
  export default function resolveConfig(
    config: Config | { [key: string]: unknown }
  ): { theme?: { [key: string]: unknown } }
}

