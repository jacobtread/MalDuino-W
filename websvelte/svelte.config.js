import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {{preprocess: AutoPreprocessGroup, kit: {adapter: Promise<void>}}} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter({out: 'dist'}),
	}
};

export default config;
