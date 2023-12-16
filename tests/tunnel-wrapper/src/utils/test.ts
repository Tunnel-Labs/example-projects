import { getExampleProjectsDirpath } from '@-/projects-config';
import type { ProjectConfig } from '@-/projects-config/types';
import { createExampleProjectTestEnv } from '@-/test-helpers';

import { execaCommand } from 'execa';
import pWaitFor from 'p-wait-for';
import path from 'pathe';
import { BrowserContext } from '@playwright/test';

export async function testTunnelWrapper({
	browserContext,
	exampleProjectSlug,
	port
}: {
	browserContext: BrowserContext;
	exampleProjectSlug: string;
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

	const startCommand = await exampleProjectConfig.getStartCommand({ port });

	const { testEnvDirpath } = await createExampleProjectTestEnv({
		testPackageSlug: 'tunnel-wrapper',
		exampleProjectSlug
	});
	await exampleProjectConfig.install({ projectDirpath: testEnvDirpath });

	const startCommandProcess = execaCommand(startCommand.command, {
		stdio: 'inherit',
		cwd: testEnvDirpath,
		env: startCommand.env
	});

	let page: Page | undefined;
	try {
		await pWaitFor(async () => {
			try {
				const response = await fetch(`http://localhost:${port}`);
				return response.status === 200;
			} catch {
				return false;
			}
		});
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
