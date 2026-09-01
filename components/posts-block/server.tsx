import { sanityFetch } from '@/sanity/lib/live'
import { postsQuery } from '@/sanity/queries/documents/post-query'
import type { PostCard, PostsBlockProps } from '@/types/components/posts-block-type'
import PostsBlock from './index'

/**
 * Fetches all posts on the server so the list is in the HTML for crawlers.
 * The client UI paginates with “Load more” without hiding content from SEO.
 */
export default async function PostsBlockServer(props: PostsBlockProps) {
  if (props.active === false) return null

  let initialPosts: PostCard[] = []
  try {
    const { data } = await sanityFetch({ query: postsQuery })
    initialPosts = (data || []) as PostCard[]
  } catch {
    initialPosts = []
  }

  return <PostsBlock {...props} initialPosts={initialPosts} />
}
