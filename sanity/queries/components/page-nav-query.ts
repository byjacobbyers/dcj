import { groq } from 'next-sanity'
import { routeQuery } from '../objects/route-query'

export const headerQuery = groq`
  *[_type == "navigation" && title == "Header"][0] {
    title,
    items[] {
      ${routeQuery}
    }
  }
`

export const footerQuery = groq`
  *[_type == "navigation" && title == "Footer"][0] {
    title,
    items[] {
      ${routeQuery}
    }
  }
`
