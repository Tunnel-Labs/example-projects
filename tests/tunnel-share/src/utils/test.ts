import { cli } from '@-/cli-helpers';
import { getExampleProjectsDirpath } from '@-/projects-config';
import type { ProjectConfig } from '@-/projects-config/types';
import { createExampleProjectTestEnv } from '@-/test-helpers';

import { execaCommand } from 'execa';
import path from 'pathe';
import waitForLocalhost from 'wait-for-localhost';

export async function testTunnelShare({
	exampleProjectSlug,
	port
}: {
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
		testPackageSlug: 'tunnel-share',
		exampleProjectSlug
	});
	await cli.bun(['install'], { cwd: testEnvDirpath, stdio: 'inherit' });

	const startCommandProcess = execaCommand(startCommand.command, {
		stdio: 'inherit',
		cwd: testEnvDirpath,
		env: startCommand.env
	});
	try {
		await waitForLocalhost({ port });

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
	} finally {
		startCommandProcess.kill();
	}
}
