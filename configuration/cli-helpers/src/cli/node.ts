import { defineCliExecutable } from 'cli-specs';
import { outdent } from 'outdent';
import which from 'which';

export const node = defineCliExecutable({
	executableName: 'node',
	executablePath: async () => which('node'),
	description: outdent`
		node
	`,
	defaultExecaOptions: {
		stdout: 'inherit',
		stderr: 'inherit'
	}
});
