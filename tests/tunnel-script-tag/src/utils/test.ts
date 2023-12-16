import type { ProjectConfig } from '@-/projects-config/types';
import { createExampleProjectTestEnv } from '@-/test-helpers';

import { execaCommand } from 'execa';
import path from 'pathe';
import waitForLocalhost from 'wait-for-localhost';
import { type Browser, expect, Page, BrowserContext } from '@playwright/test';
import { getExampleProjectsDirpath } from '@-/projects-config';
import kill from 'tree-kill';

export async function testScriptTag({
	browserContext,
	exampleProjectSlug,
	projectId,
	branch,
	port
}: {
	browserContext: BrowserContext;
	exampleProjectSlug: string;
	projectId: string;
	branch: string;
	port: number;
}) {
	const exampleProjectDirpath = path.join(
		getExampleProjectsDirpath(),
		exampleProjectSlug
	);

	const exampleProjectConfigFilepath = path.join(
		exampleProjectDirpath,
		'.tunnel/config.mts'
	);

	const { default: exampleProjectConfig } = (await import(
		exampleProjectConfigFilepath
	)) as { default: ProjectConfig };

	const { testEnvDirpath } = await createExampleProjectTestEnv({
		testPackageSlug: 'tunnel-script-tag',
		exampleProjectSlug
	});

	await exampleProjectConfig.addScriptTag({
		projectDirpath: testEnvDirpath,
		branch: 'main',
		projectId: 'test'
	});
	await exampleProjectConfig.install({ projectDirpath: testEnvDirpath });

	const startCommand = await exampleProjectConfig.getStartCommand({ port });
	const startCommandProcess = execaCommand(startCommand.command, {
		stdio: 'inherit',
		cwd: testEnvDirpath,
		env: startCommand.env
	});

	let page: Page | undefined;

	try {
		await waitForLocalhost({ port });
		page = await browserContext.newPage();
		await page.goto(`http://localhost:${port}`);
		await expect(
			page.locator('tunnel-toolbar').getByText('Sign in')
		).toBeVisible();
	} finally {
		if (startCommandProcess.pid !== undefined) {
			kill(startCommandProcess.pid);
		}

		await page?.close();
	}
}
