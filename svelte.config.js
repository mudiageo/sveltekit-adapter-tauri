import adapter from './node_modules/sveltekit-adapter-tauri/dist/index.js';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({ mode: 'spa' })
	}
};

export default config;
