#!/usr/bin/env tun

import { cli } from '@-/cli-helpers';
import { getEnvVariables } from '@-/env';
import { monorepoDirpath } from '@-/packages-config';
import { defineTestEnvironment } from '@-/test-environment';
import path from 'pathe';

// We call `getEnvVariables` early  throw an error if environment variables aren't properly set
await getEnvVariables();

await cli.pnpm(['exec', 'vitest', 'run', ...process.argv.slice(2)], {
	stdio: 'inherit',
	cwd: path.join(monorepoDirpath, 'tests/tunnel-share'),
	env: {
		TEST_ENVIRONMENT: JSON.stringify(
			defineTestEnvironment({
				'tunnel-script-tag': {},
				'tunnel-share': {},
				'tunnel-wrapper': {}
			})
		)
	}
});
