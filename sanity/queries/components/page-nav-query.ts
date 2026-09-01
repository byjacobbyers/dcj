import { defineQuery } from 'next-sanity'
import { routeQuery } from '../objects/route-query'

export const headerQuery = defineQuery(`
  *[_type == "navigation" && title == "Header"][0] {
    title,
    items[] {
      ${routeQuery}
    }
  }
`)

export const footerQuery = defineQuery(`
  *[_type == "navigation" && title == "Footer"][0] {
    title,
    items[] {
      ${routeQuery}
    }
  }
`)
