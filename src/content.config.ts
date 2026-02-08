import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
	loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		author: z.string().optional(),
		excerpt: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

const skillsCollection = defineCollection({
	loader: async () => {
		const baseUrl = 'https://raw.githubusercontent.com/hallucinaut/skills-pi/main/skills';
		const summaryUrl = `${baseUrl}/SUMMARY.md`;
		
		try {
			const response = await fetch(summaryUrl);
			if (!response.ok) throw new Error('Failed to fetch SUMMARY.md');
			const text = await response.text();
			
			// Extract skill names from SUMMARY.md (table format: | name | description | type |)
			const lines = text.split('\n');
			const skills = [];
			
			for (const line of lines) {
				if (line.includes('|') && !line.includes('---') && !line.includes('Skill |')) {
					const parts = line.split('|').map(p => p.trim()).filter(p => p !== '');
					if (parts.length >= 1) {
						const path = parts[0]; // e.g., 'backend-api'
						const skillUrl = `${baseUrl}/${path}/SKILL.md`;
						
						const skillResponse = await fetch(skillUrl);
						if (!skillResponse.ok) continue;
						const skillText = await skillResponse.text();
						
						// Basic frontmatter parsing
						const fmMatch = skillText.match(/^---\n([\s\S]*?)\n---/);
						let data = { title: path, description: parts[1] || '', category: parts[2] || 'tool', language: 'markdown' };
						let body = skillText;
						
						if (fmMatch) {
							const fm = fmMatch[1];
							body = skillText.replace(fmMatch[0], '').trim();
							
							const fmLines = fm.split('\n');
							for (const fmLine of fmLines) {
								const [key, ...val] = fmLine.split(':');
								if (key && val) {
									const k = key.trim();
									const v = val.join(':').trim().replace(/^["']|["']$/g, '');
									if (k === 'name') data.title = v;
									if (k === 'description') data.description = v;
								}
							}
						}
						
						skills.push({
							id: path,
							...data,
							body
						});
					}
				}
			}
			
			return skills;
		} catch (e) {
			console.error('Error loading remote skills:', e);
			return [];
		}
	},
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: z.string().default('tool'), // Relaxed for external data
		language: z.string().default('markdown'),
		body: z.string().optional(),
	}),
});

export const collections = {
	blog: blogCollection,
    skills: skillsCollection,
};
