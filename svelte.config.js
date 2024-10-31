import adapter from 'sveltekit-adapter-tauri';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
	adapter: adapter({mode:'spa'})
	}
};

export default config;
