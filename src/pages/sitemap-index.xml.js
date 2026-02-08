export const prerender = true;

export async function GET(context) {
	const baseUrl = 'https://myblog.com';
	const posts = await context.locals.content?.collections?.blog;

	if (!posts) {
		return new Response('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${baseUrl}/</loc></url></urlset>', {
			headers: {
				'Content-Type': 'application/xml',
			},
		});
	}

	const urls = [
		{
			loc: `${baseUrl}/`,
			lastmod: new Date().toISOString().split('T')[0],
			changefreq: 'daily',
			priority: '1.0',
		},
		{
			loc: `${baseUrl}/blog`,
			lastmod: new Date().toISOString().split('T')[0],
			changefreq: 'daily',
			priority: '0.8',
		},
	];

	posts.forEach((post) => {
		urls.push({
			loc: `${baseUrl}/blog/${post.slug}/`,
			lastmod: post.data.date.toISOString().split('T')[0],
			changefreq: 'weekly',
			priority: '0.6',
		});
	});

	return urls.map(
		(url) =>
			`<url>
<loc>${url.loc}</loc>
<lastmod>${url.lastmod}</lastmod>
<changefreq>${url.changefreq}</changefreq>
<priority>${url.priority}</priority>
</url>`
	).join('\n');
}
