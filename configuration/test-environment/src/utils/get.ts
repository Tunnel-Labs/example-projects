import type { TestEnvironment } from '../types/environment.ts';

export function getTestEnvironment(): TestEnvironment {
	if (!process.env.TEST_ENVIRONMENT) {
		throw new Error('TEST_ENVIRONMENT environment variable not set');
	}

	return JSON.parse(process.env.TEST_ENVIRONMENT);
}
