// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://myblog.com',
	content: {
		collections: {
			blog: {
				type: 'content',
			},
		},
	},
});
