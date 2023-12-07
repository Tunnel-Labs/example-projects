import { getExampleProjects } from '@-/projects-config';
import { describe, test } from 'vitest';
import { testTunnelShare } from '../src/utils/share.ts';

describe('`tunnel share` works with example projects', async () => {
	const exampleProjects = await getExampleProjects();
	for (const [exampleProjectSlug, exampleProject] of Object.entries(
		exampleProjects
	)) {
		test(`\`tunnel share\` works with example project ${exampleProjectSlug}`, async () => {
			await testTunnelShare({
				exampleProjectSlug
			});
		});
	}
});
