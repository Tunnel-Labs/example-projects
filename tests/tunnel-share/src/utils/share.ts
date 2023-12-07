import { cli } from '@-/cli-helpers';
import { monorepoDirpath } from '@-/packages-config';
import {
	getExampleProjects,
	getExampleProjectsDirpath
} from '@-/projects-config';
import type { ProjectConfig } from '@-/projects-config/types';
import { createExampleProjectTestEnv } from '@-/test-helpers';

import { execaCommand } from 'execa';
import got from 'got';
import path from 'pathe';
import waitForLocalhost from 'wait-for-localhost';

export async function testTunnelShare({
	exampleProjectSlug
}: {
	exampleProjectSlug: string;
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

	const startCommand = await exampleProjectConfig.getStartCommand();

	const { testEnvDirpath } = await createExampleProjectTestEnv({
		testPackageSlug: 'tunnel-share',
		exampleProjectSlug
	});
	await cli.bun(['install'], { cwd: testEnvDirpath, stdio: 'inherit' });

	const startCommandProcess = execaCommand(startCommand, {
		stdio: 'inherit',
		cwd: testEnvDirpath
	});
	await waitForLocalhost({ port: exampleProjectConfig.port });

	const { process: tunnelShareProcess } = await cli.tunnel.getProcess(
		['share', '.'],
		{
			cwd: testEnvDirpath,
			stdio: 'pipe'
		}
	);

	const tunnelappUrl = await new Promise((resolve) => {
		tunnelShareProcess.stdout!.on('data', (data) => {
			console.log(data.toString());
			if (data.includes('URL')) {
				resolve(data);
			}
		});
	});

	console.log(tunnelappUrl);
}
