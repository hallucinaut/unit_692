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
	loader: glob({ pattern: '**/[^_]*.md', base: './src/content/skills' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: z.enum(['prompt', 'workflow', 'script', 'tool', 'security']),
		language: z.string().default('markdown'),
	}),
});

export const collections = {
	blog: blogCollection,
    skills: skillsCollection,
};
