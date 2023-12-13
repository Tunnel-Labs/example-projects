import { defineProject, configDefaults } from 'vitest/config';

export default defineProject({
	test: {
		exclude: [...configDefaults.exclude, '**/.test-env'],
		testTimeout: 60_000,
		globalSetup: './test/global-setup.ts',
		poolOptions: {
			isolate: false
		}
	}
});
