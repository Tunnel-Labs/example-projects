import { getExampleProjects } from '@-/projects-config';
import { beforeAll, describe, test, afterAll } from 'vitest';
import { testScriptTag } from '../src/utils/test.ts';
import { type Browser, chromium, Page } from '@playwright/test';
import { getTestEnvironment } from '@-/test-helpers';
import getPort from 'get-port';

const browser = await chromium.launch();

describe('tunnel <script> works with example projects', async () => {
	const exampleProjects = await getExampleProjects();
	for (const [exampleProjectSlug, exampleProject] of Object.entries(
		exampleProjects
	)) {
		test.skipIf(exampleProjectSlug.includes('shopify-app'))(
			`tunnel <script> works with example project ${exampleProjectSlug}`,
			async () => {
				const page = await browser.newPage();
				const port = await getPort();
				const { branch, projectId } = getTestEnvironment();
				await testScriptTag({
					port,
					exampleProjectSlug,
					page,
					branch,
					projectId
				});
				await page.close();
			}
		);
	}
});
