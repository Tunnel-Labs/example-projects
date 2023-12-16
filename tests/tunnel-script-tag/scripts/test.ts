#!/usr/bin/env tun

import { cli } from '@-/cli-helpers';
import { getEnvVariables } from '@-/env';
import { monorepoDirpath } from '@-/packages-config';
import { defineTestEnvironment } from '@-/test-environment';

// We call `getEnvVariables` early  throw an error if environment variables aren't properly set
await getEnvVariables();

await cli.pnpm(
	[
		'exec',
		'vitest',
		'run',
		'--pool=forks',
		'--poolOptions.forks.singleFork=true',
		'--poolOptions.threads.singleThread=true',
		'--poolOptions.threads.isolate=false',
		'--reporter=dot',
		...process.argv.slice(2)
	],
	{
		stdio: 'inherit',
		cwd: monorepoDirpath,
		env: {
			TEST_ENVIRONMENT: JSON.stringify(
				defineTestEnvironment({
					'tunnel-script-tag': {},
					'tunnel-share': {},
					'tunnel-wrapper': {}
				})
			)
		}
	}
);
