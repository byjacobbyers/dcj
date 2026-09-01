/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({
  api: { projectId, dataset },
  typegen: {
    path: './sanity/queries/**/*.{ts,tsx}',
    schema: './schema.json',
    generates: './sanity.types.ts',
    // defineLive's sanityFetch doesn't use @sanity/client overloads; we type fetches explicitly.
    overloadClientMethods: false,
  },
})
