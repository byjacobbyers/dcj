import { defineQuery } from 'next-sanity'

export const SignInSettingsQuery = defineQuery(`*[_type == "site"][0] {
  guidelinesVersion
}`)
