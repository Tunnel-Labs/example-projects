import { cli } from '@-/cli-helpers';
import { monorepoDirpath } from '@-/packages-config';
import type { ProjectConfig } from '@-/project-config/types';

import { execaCommand } from 'execa';
import got from 'got';
import path from 'pathe';
import waitForLocalhost from 'wait-for-localhost';

export async function tunnelShare({
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
	const startCommandProcess = execaCommand(startCommand);

	await waitForLocalhost({ port: exampleProjectConfig.port });

	const response = await got(`http://localhost:${exampleProjectConfig.port}`);

	await cli.tunnel(['share', '.'], {

	})
}
