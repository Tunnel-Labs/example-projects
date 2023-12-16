import { getExampleProjects } from '@-/projects-config';
import { describe, test } from 'vitest';
import { testScriptTag } from '../src/utils/test.ts';
import { getTestEnvironment } from '@-/test-helpers';
import getPort from 'get-port';
import { getGlobalThis } from './utils/global-this.ts';

describe('tunnel <script> works with example projects', async () => {
	const exampleProjects = await getExampleProjects();
	for (const [exampleProjectSlug, exampleProject] of Object.entries(
		exampleProjects
	)) {
		if (exampleProjectSlug.includes('shopify-app')) {
			continue;
		}

		test.concurrent(
			`tunnel <script> works with example project ${exampleProjectSlug}`,
			async () => {
				const { browserContext } = getGlobalThis();
				const port = await getPort();
				const { branch, projectId } = getTestEnvironment();
				await testScriptTag({
					browserContext,
					port,
					exampleProjectSlug,
					branch,
					projectId
				});
			}
		);
	}
});
