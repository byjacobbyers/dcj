/** TTF only — Satori rejects WOFF2. Cache buffers across requests (warm isolates on Edge). */
const ogFont = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Font fetch ${r.status}`)
    return r.arrayBuffer()
  })

const roboto = (file: string) =>
  ogFont(`https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/${file}`)

/** Site wordmark font (matches --font-heading / Major Mono Display, single 400 weight). */
const MAJOR_MONO_URL =
  'https://raw.githubusercontent.com/google/fonts/main/ofl/majormonodisplay/MajorMonoDisplay-Regular.ttf'

let fontsPromise: Promise<[ArrayBuffer, ArrayBuffer, ArrayBuffer]> | null = null

export async function loadOgFonts(): Promise<
  Array<{ name: string; data: ArrayBuffer; style: 'normal'; weight: 400 | 700 }>
> {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      roboto('Roboto-Regular.ttf'),
      roboto('Roboto-Bold.ttf'),
      ogFont(MAJOR_MONO_URL),
    ])
  }
  try {
    const [regular, bold, majorMono] = await fontsPromise
    return [
      { name: 'Roboto', data: regular, style: 'normal', weight: 400 },
      { name: 'Roboto', data: bold, style: 'normal', weight: 700 },
      { name: 'Major Mono Display', data: majorMono, style: 'normal', weight: 400 },
    ]
  } catch {
    fontsPromise = null
    return []
  }
}
