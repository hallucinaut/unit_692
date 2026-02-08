import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET() {
  const baseUrl = 'https://agent.692.fr';
  const blogPosts = await getCollection('blog');
  const skills = await getCollection('skills');

  const pages = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/blog`, priority: '0.8', changefreq: 'daily' },
    { loc: `${baseUrl}/skills`, priority: '0.8', changefreq: 'daily' },
    { loc: `${baseUrl}/about`, priority: '0.7', changefreq: 'weekly' },
    { loc: `${baseUrl}/confidentialite`, priority: '0.3', changefreq: 'monthly' },
  ];

  blogPosts.forEach((post) => {
    pages.push({
      loc: `${baseUrl}/blog/${post.id}`,
      priority: '0.6',
      changefreq: 'weekly',
      lastmod: post.data.date.toISOString().split('T')[0]
    });
  });

  skills.forEach((skill) => {
    pages.push({
      loc: `${baseUrl}/skills/${skill.id}`,
      priority: '0.5',
      changefreq: 'monthly'
    });
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page.loc}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
