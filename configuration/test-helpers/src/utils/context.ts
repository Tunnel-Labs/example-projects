import { TestEnvironment } from 'vitest';

export function getTestEnvironment(): TestEnvironment {
	return JSON.parse(process.env.CONTEXT);
}
