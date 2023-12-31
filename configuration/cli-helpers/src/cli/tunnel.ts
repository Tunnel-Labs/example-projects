import { defineCliExecutable } from 'cli-specs';
import { outdent } from 'outdent';
import which from 'which';

export const tunnel = defineCliExecutable({
	executableName: 'tunnel',
	executablePath: async () => which('tunnel'),
	description: outdent`
		tunnel
	`,
	async install() {
		throw new Error('not implemented');
	},
	defaultExecaOptions: {
		stdout: 'inherit',
		stderr: 'inherit'
	}
});
