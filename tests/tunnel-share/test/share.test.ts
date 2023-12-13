import { getExampleProjects } from '@-/projects-config';
import { describe, test } from 'vitest';
import { testTunnelShare } from '../src/utils/test.ts';
import getPort from 'get-port';

describe.skip('`tunnel share` works with example projects', async () => {
	const exampleProjects = await getExampleProjects();
	for (const [exampleProjectSlug, exampleProject] of Object.entries(
		exampleProjects
	)) {
		test.skip(`\`tunnel share\` works with example project ${exampleProjectSlug}`, async () => {
			const port = await getPort();
			await testTunnelShare({
				exampleProjectSlug,
				port
			});
		});
	}
});
