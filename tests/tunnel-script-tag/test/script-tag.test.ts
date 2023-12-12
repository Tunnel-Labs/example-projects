import { getExampleProjects } from '@-/projects-config';
import { afterAll, beforeAll, describe, test } from 'vitest';
import { testScriptTag } from '../src/utils/test.ts';
import { type Browser, chromium } from '@playwright/test';
import { getTestEnvironment } from '@-/test-helpers';
import getPort from 'get-port';

describe('tunnel <script> works with example projects', async () => {
	const exampleProjects = await getExampleProjects();
	for (const [exampleProjectSlug, exampleProject] of Object.entries(
		exampleProjects
	)) {
		let browser: Browser;
		beforeAll(async () => {
			browser = await chromium.launch({ headless: false });
		});

		// afterAll(async () => {
		// 	await browser.close();
		// });

		test.skipIf(exampleProjectSlug.includes('shopify-app'))(
			`tunnel <script> works with example project ${exampleProjectSlug}`,
			async () => {
				const port = await getPort();
				const { branch, projectId } = getTestEnvironment();
				await testScriptTag({
					port,
					exampleProjectSlug,
					browser,
					branch,
					projectId
				});
			}
		);
	}
});
