import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		date: z.string().transform((val) => new Date(val)),
		author: z.string().optional(),
		excerpt: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

export const collections = {
	blog: blogCollection,
};
