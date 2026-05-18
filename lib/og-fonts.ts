/** TTF only — Satori rejects WOFF2. Cache buffers across requests (warm isolates on Edge). */
const ogFont = (file: string) =>
  fetch(`https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/${file}`).then((r) => {
    if (!r.ok) throw new Error(`Font fetch ${r.status}`)
    return r.arrayBuffer()
  })

let fontsPromise: Promise<[ArrayBuffer, ArrayBuffer]> | null = null

export async function loadOgFonts(): Promise<
  Array<{ name: string; data: ArrayBuffer; style: 'normal'; weight: 400 | 700 }>
> {
  if (!fontsPromise) {
    fontsPromise = Promise.all([ogFont('Roboto-Regular.ttf'), ogFont('Roboto-Bold.ttf')])
  }
  try {
    const [regular, bold] = await fontsPromise
    return [
      { name: 'Roboto', data: regular, style: 'normal', weight: 400 },
      { name: 'Roboto', data: bold, style: 'normal', weight: 700 },
    ]
  } catch {
    fontsPromise = null
    return []
  }
}
