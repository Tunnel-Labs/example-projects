import type { ProjectConfig } from '@-/projects-config/types';
import { createExampleProjectTestEnv } from '@-/test-helpers';

import { execaCommand } from 'execa';
import path from 'pathe';
import pWaitFor from 'p-wait-for';
import { expect } from 'playwright/test';
import type { Page } from 'playwright';
import { getExampleProjectsDirpath } from '@-/projects-config';
import kill from 'tree-kill';

export async function testScriptTag({
	page,
	exampleProjectSlug,
	projectId,
	branch,
	port
}: {
	page: Page;
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

	try {
		await pWaitFor(async () => {
			try {
				const response = await fetch(`http://localhost:${port}`);
				return response.status === 200;
			} catch {
				return false;
			}
		});
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
