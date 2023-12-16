import { configDefaults, UserProjectConfigExport } from 'vitest/config';

export default {
	test: {
		exclude: [...configDefaults.exclude, '**/.test-env'],
		testTimeout: 60_000,
		setupFiles: './test/global-setup.ts'
	}
} satisfies UserProjectConfigExport;
