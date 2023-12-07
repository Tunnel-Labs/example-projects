import { cli } from '@-/cli-helpers';
import type { ProjectConfig } from '@-/projects-config/types';
import { createExampleProjectTestEnv } from '@-/test-helpers';

import { execaCommand } from 'execa';
import path from 'pathe';
import waitForLocalhost from 'wait-for-localhost';
import { type Browser, expect } from '@playwright/test';
import { getExampleProjectsDirpath } from '@-/projects-config';
import getPort from 'get-port';

export async function testScriptTag({
	browser,
	exampleProjectSlug,
	projectId,
	branch,
	port
}: {
	browser: Browser;
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

	await cli.bun(['install'], { cwd: testEnvDirpath, stdio: 'inherit' });

	const startCommand = await exampleProjectConfig.getStartCommand({ port });
	const startCommandProcess = execaCommand(startCommand.command, {
		stdio: 'inherit',
		cwd: testEnvDirpath,
		env: startCommand.env
	});
	await waitForLocalhost({ port });

	// Open localhost in the browser and check that the script tag is present on the document
	const page = await browser.newPage();
	page.goto(`http://localhost:${port}`);
	await expect(page.locator('text=modal title')).toBeVisible();
}
