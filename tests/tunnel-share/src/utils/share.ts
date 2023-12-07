import { cli } from '@-/cli-helpers';
import { monorepoDirpath } from '@-/packages-config';
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
		monorepoDirpath,
		'projects',
		exampleProjectSlug
	);

	const exampleProjectConfigFilepath = path.join(
		exampleProjectDirpath,
		'.tunnel/config.mts'
	);

	const exampleProjectConfig = (await import(
		exampleProjectConfigFilepath
	)) as ProjectConfig;

	const startCommand = await exampleProjectConfig.getStartCommand();

	const { testEnvDirpath } = await createExampleProjectTestEnv({
		testPackageSlug: 'tunnel-share',
		exampleProjectSlug
	});
	await cli.bun(['install'], { cwd: testEnvDirpath });

	const startCommandProcess = execaCommand(startCommand);
	await waitForLocalhost({ port: exampleProjectConfig.port });

	const { process: tunnelShareProcess } = await cli.tunnel.getProcess(
		['share', '.'],
		{
			cwd: testEnvDirpath,
			stdio: 'pipe'
		}
	);

	tunnelShareProcess.stdout!.on('data', (data) => {
		if (data.includes('URL')) {
			console.log(data);
		}
	});
}
