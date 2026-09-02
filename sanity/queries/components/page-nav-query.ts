import { defineQuery } from 'next-sanity'
import { routeQuery } from '../objects/route-query'

export const headerQuery = defineQuery(`
  *[_type == "navigation" && title == "Header"][0] {
    title,
    items[] {
      _type == 'route' => {
        ${routeQuery}
      },
      _type == 'subNav' => {
        _key,
        _type,
        title,
        display,
        items[] {
          _key,
          description,
          route {
            ${routeQuery}
          }
        }
      }
    }
  }
`)

export const footerQuery = defineQuery(`
  *[_type == "navigation" && title == "Footer"][0] {
    title,
    items[] {
      _type == 'route' => {
        ${routeQuery}
      },
      _type == 'subNav' => {
        _key,
        _type,
        title,
        display,
        items[] {
          _key,
          description,
          route {
            ${routeQuery}
          }
        }
      }
    }
  }
`)
