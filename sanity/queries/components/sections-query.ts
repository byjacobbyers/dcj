import { groq } from 'next-sanity'
import { imageQuery } from '../objects/image-query'
import { routeQuery } from '../objects/route-query'
import { muxAssetProjection, videoQuery } from '../objects/video-query'

/** Inline link (new) or nested `route` object (legacy portable text). */
const linkWithRouteMarkDef = `_type == 'linkWithRoute' => select(
  defined(linkType) => { ${routeQuery} },
  route { ${routeQuery} }
)`

const portableTextObjectExtras = `
  _type == 'buttonPair' => {
    _key,
    _type,
    left { ${routeQuery} },
    right { ${routeQuery} }
  },
`

const portableTextWithLinks = `content[] {
  ...,
  ${portableTextObjectExtras}
  markDefs[] {
    ...,
    ${linkWithRouteMarkDef}
  }
}`

export const sectionsQuery = groq`
  sections[] {
    ...,
    _type == 'coverBlock' => {
      ...,
      image { ${imageQuery} },
      imageMobile { ${imageQuery} },
      content[] {
        ...,
        markDefs[] {
          ...,
          ${linkWithRouteMarkDef}
        }
      },
      cta { ..., route { ${routeQuery} } }
    },
    _type == 'coverVideo' => {
      ...,
      muxUrl {
        _type,
        asset-> {
          ${muxAssetProjection}
        },
        thumbTime
      },
      muxUrlMobile {
        _type,
        asset-> {
          ${muxAssetProjection}
        },
        thumbTime
      },
      content[] {
        ...,
        markDefs[] {
          ...,
          ${linkWithRouteMarkDef}
        }
      },
      cta { ..., route { ${routeQuery} } }
    },
    _type == 'heroBlock' => {
      ...,
      image { ${imageQuery} },
      video { ${videoQuery} },
      cta { ..., route { ${routeQuery} } },
      ${portableTextWithLinks}
    },
    _type == 'ctaBlock' => {
      ...,
      alignment,
      cta { ..., route { ${routeQuery} } },
      ${portableTextWithLinks}
    },
    _type == 'textBlock' => {
      ...,
      contentAlignment,
      ${portableTextWithLinks}
    },
    _type == 'embedBlock' => {
      ...,
      embedCode {
        _type,
        code,
        language,
        filename
      }
    },
    _type == 'formBlock' => {
      ...,
      ${portableTextWithLinks}
    },
    _type == 'imageBlock' => {
      ...,
      image { ${imageQuery} },
      imageMobile { ${imageQuery} }
    },
    _type == 'columnBlock' => {
      ...,
      header[] {
        ...,
        markDefs[] {
          ...,
          ${linkWithRouteMarkDef}
        }
      },
      footer[] {
        ...,
        markDefs[] {
          ...,
          ${linkWithRouteMarkDef}
        }
      },
      cta { ..., route { ${routeQuery} } },
      columns[] {
        ...,
        content[] {
          ...,
          markDefs[] {
            ...,
            ${linkWithRouteMarkDef}
          }
        },
        image { ${imageQuery} },
        cta { ..., route { ${routeQuery} } }
      }
    },
    _type == 'galleryBlock' => {
      ...,
      images[] { ${imageQuery} }
    },
    _type == 'videoBlock' => {
      ...,
      muxUrl { asset-> { playbackId } },
      muxUrlMobile { asset-> { playbackId } }
    },
    _type == 'faqBlock' => {
      ...,
      faqs[] {
        question,
        answer[] {
          ...,
          markDefs[] {
            ...,
            ${linkWithRouteMarkDef}
          }
        }
      }
    },
    _type == 'splitScrollBlock' => {
      ...,
      title[] {
        ...,
        markDefs[] {
          ...,
          ${linkWithRouteMarkDef}
        }
      },
      items[] {
        ...,
        image { ${imageQuery} },
        content[] {
          ...,
          markDefs[] {
            ...,
            ${linkWithRouteMarkDef}
          }
        }
      }
    },
    _type == 'problemBlock' => {
      ...,
      content[] {
        ...,
        markDefs[] {
          ...,
          ${linkWithRouteMarkDef}
        }
      },
      columns[] {
        ...,
        image { ${imageQuery} },
        content[] {
          ...,
          markDefs[] {
            ...,
            ${linkWithRouteMarkDef}
          }
        }
      },
      excerpt[] {
        ...,
        markDefs[] {
          ...,
          ${linkWithRouteMarkDef}
        }
      }
    }
  }
`
