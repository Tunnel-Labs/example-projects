import { configDefaults, UserProjectConfigExport } from 'vitest/config';

export default {
	test: {
		exclude: [...configDefaults.exclude, '**/.test-env'],
		testTimeout: 60_000
	}
} satisfies UserProjectConfigExport;
