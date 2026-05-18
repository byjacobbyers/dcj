export type SectionsBodyBlock = { _type?: string; _key?: string } & Record<string, unknown>

export type SectionsProps = {
  body?: SectionsBodyBlock[]
}
