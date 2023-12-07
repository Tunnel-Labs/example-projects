import { TestEnvironment } from '@-/test-environment/types';

export function getTestEnvironment(): TestEnvironment {
	return JSON.parse(process.env.TEST_ENVIRONMENT);
}
