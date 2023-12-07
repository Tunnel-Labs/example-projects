import { cli } from '@-/cli-helpers';
import { monorepoDirpath } from '@-/packages-config';
import type { ProjectConfig } from '@-/projects-config/types';
import { createExampleProjectTestEnv } from '@-/test-helpers';

import { execaCommand } from 'execa';
import got from 'got';
import path from 'pathe';
import waitForLocalhost from 'wait-for-localhost';
import { type Browser, expect } from '@playwright/test';

export async function testScriptTag({
	browser,
	exampleProjectSlug,
	projectId,
	branch
}: {
	browser: Browser;
	exampleProjectSlug: string;
	projectId: string;
	branch: string;
}) {
	const exampleProjectDirpath = path.join(
		monorepoDirpath,
		'projects',
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
		testPackageSlug: 'tunnel-share',
		exampleProjectSlug
	});

	await exampleProjectConfig.addScriptTag({
		projectDirpath: testEnvDirpath,
		branch: 'main',
		projectId: 'test'
	});

	await cli.bun(['install'], { cwd: testEnvDirpath, stdio: 'inherit' });

	const startCommand = await exampleProjectConfig.getStartCommand();
	const startCommandProcess = execaCommand(startCommand, {
		stdio: 'inherit',
		cwd: testEnvDirpath
	});
	await waitForLocalhost({ port: exampleProjectConfig.port });

	// Open localhost in the browser and check that the script tag is present on the document
	const page = await browser.newPage();
	page.goto(`http://localhost:${exampleProjectConfig.port}`);
	await expect(page.locator('text=modal title')).toBeVisible();
}
