import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		exclude: [...configDefaults.exclude, '**/.test-env'],
		testTimeout: 60_000,
		setupFiles: './test/global-setup.ts',
		pool: 'forks',
		poolOptions: {
			forks: {
				singleFork: true,
				isolate: false
			},
			threads: {
				singleThread: true,
				isolate: false
			}
		},
		reporters: ['dot']
	}
});
