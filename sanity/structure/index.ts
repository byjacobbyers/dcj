import type { StructureResolver } from 'sanity/structure'
import Page from './page-structure'
import Event from './event-structure'
import Announcement from './announcement-structure'
import SiteSettings from './site-settings-structure'
import Navigation from './navigation-structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      Page(S),
      Event(S),
      Announcement(S),
      SiteSettings(S),
      Navigation(S),
    ])
