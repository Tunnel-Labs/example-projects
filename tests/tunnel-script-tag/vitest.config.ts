import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		exclude: [...configDefaults.exclude, '**/.test-env'],
		testTimeout: 60_000,
		setupFiles: './test/global-setup.ts',
		pool: 'forks',
		maxConcurrency: Number.MAX_SAFE_INTEGER,
		poolOptions: {
			forks: {
				singleFork: true,
				isolate: false
			}
		},
		reporters: ['dot']
	}
});
