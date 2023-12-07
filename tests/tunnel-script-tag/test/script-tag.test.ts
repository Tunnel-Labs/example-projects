import { getExampleProjects } from '@-/projects-config';
import { afterAll, beforeAll, describe, test } from 'vitest';
import { testScriptTag } from '../src/utils/test.ts';
import { type Browser, chromium } from '@playwright/test';
import { getTestEnvironment } from '@-/test-helpers';

describe('tunnel <script> works with example projects', async () => {
	const exampleProjects = await getExampleProjects();
	for (const [exampleProjectSlug, exampleProject] of Object.entries(
		exampleProjects
	)) {
		let browser: Browser;
		beforeAll(async () => {
			browser = await chromium.launch();
		});

		afterAll(async () => {
			await browser.close();
		});

		test(`tunnel <script> works with example project ${exampleProjectSlug}`, async () => {
			const { branch, projectId } = getTestEnvironment()
			await testScriptTag({
				exampleProjectSlug,
				browser,
				branch,
				projectId
			});
		});
	}
});
