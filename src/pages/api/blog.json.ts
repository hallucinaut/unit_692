import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Pre-render this as a static JSON file for GitHub Pages
export const prerender = true;

export const GET: APIRoute = async () => {
  // Fetch all blog posts
  const allPosts = await getCollection('blog');

  // Return ALL posts data for client-side random selection
  const postsData = allPosts.map(post => {
    const formattedDate = post.data.date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '.');

    return {
      id: post.id,
      title: post.data.title,
      excerpt: post.data.excerpt,
      date: post.data.date.toISOString(),
      formattedDate,
      url: `/blog/${post.id}/`,
    };
  });

  return new Response(
    JSON.stringify(postsData),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
