import { getExampleProjectsDirpath } from '@-/projects-config';
import type { ProjectConfig } from '@-/projects-config/types';
import { createExampleProjectTestEnv } from '@-/test-helpers';

import { ExecaChildProcess, execaCommand } from 'execa';
import pWaitFor from 'p-wait-for';
import path from 'pathe';
import { expect } from 'playwright/test';
import type { BrowserContext, Page } from 'playwright';
import kill from 'tree-kill';
import { excludeKeys } from 'filter-obj';

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

	const { testEnvDirpath } = await createExampleProjectTestEnv({
		testPackageSlug: 'tunnel-wrapper',
		exampleProjectSlug
	});
	await exampleProjectConfig.install({ projectDirpath: testEnvDirpath });

	const wrapperStartCommandOrUndefined =
		await exampleProjectConfig.addWrapperCommand({
			projectDirpath: testEnvDirpath,
			port
		});

	let wrapperCommandProcess: ExecaChildProcess;
	if (wrapperStartCommandOrUndefined === undefined) {
		const startCommand = await exampleProjectConfig.getStartCommand({ port });
		wrapperCommandProcess = execaCommand(startCommand.command, {
			stdio: 'inherit',
			cwd: testEnvDirpath,
			env: excludeKeys(startCommand.env ?? {}, ['PORT'])
		});
	} else {
		wrapperCommandProcess = execaCommand(
			wrapperStartCommandOrUndefined.command,
			{
				stdio: 'inherit',
				cwd: testEnvDirpath,
				env: wrapperStartCommandOrUndefined.env
			}
		);
	}

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
		if (wrapperCommandProcess.pid !== undefined) {
			kill(wrapperCommandProcess.pid);
		}

		await page?.close();
	}
}
