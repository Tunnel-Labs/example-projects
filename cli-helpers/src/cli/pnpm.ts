import { defineCliExecutable } from 'cli-specs';
import { outdent } from 'outdent';
import which from 'which';

export const pnpm = defineCliExecutable({
	executableName: 'pnpm',
	executablePath: async () => which('pnpm'),
	description: outdent`
		pnpm
	`,
	defaultExecaOptions: {
		stdout: 'inherit',
		stderr: 'inherit'
	}
});
