import { getExampleProjects } from '@-/projects-config';
import { describe, test } from 'vitest';
import { testTunnelWrapper } from '../src/utils/test.ts';
import getPort from 'get-port';
import { getGlobalThis } from './utils/global-this.ts';

describe('`tunnel share` works with example projects', async () => {
	const exampleProjects = await getExampleProjects();
	for (const [exampleProjectSlug, exampleProject] of Object.entries(
		exampleProjects
	)) {
		test.concurrent(
			`\`tunnel wrapper\` works with example project ${exampleProjectSlug}`,
			async () => {
				const port = await getPort();
				const { browserContext } = getGlobalThis();
				await testTunnelWrapper({
					browserContext,
					exampleProjectSlug,
					port
				});
			}
		);
	}
});
