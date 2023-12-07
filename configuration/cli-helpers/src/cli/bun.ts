import { defineCliExecutable } from 'cli-specs';
import { outdent } from 'outdent';
import which from 'which';

export const bun = defineCliExecutable({
	executableName: 'bun',
	executablePath: async () => which('bun'),
	description: outdent`
		bun
	`,
	defaultExecaOptions: {
		stdout: 'inherit',
		stderr: 'inherit'
	}
});
