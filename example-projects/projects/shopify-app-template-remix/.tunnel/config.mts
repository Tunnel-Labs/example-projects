import { cli } from '@-/cli-helpers';
import { defineProjectConfig } from '@-/projects-config';
import { outdent } from 'outdent';
import {
	addDependency,
	getReplaceInFile
} from '../../../src/utils/get-script-tag.ts';

export default defineProjectConfig({
	async install({ projectDirpath }) {
		await cli.bun('install', { cwd: projectDirpath });
	},
	async getStartCommand({ port }) {
		return {
			command: `${await cli.bun.getExecutablePath()} run dev`,
			env: { PORT: String(port) }
		};
	},
	async addScriptTag({ projectDirpath, branch, projectId }) {
		const replaceInFile = getReplaceInFile({ projectDirpath });
		await addDependency({ replaceInFile, packageName: '@tunnel/react' });
		await replaceInFile({
			files: 'app/root.tsx',
			from: [/^/, '<body>'],
			to: [
				"import { TunnelToolbar } from '@tunnel/react'\n",
				outdent`
					<body>
						<TunnelToolbar
							projectId=${JSON.stringify(projectId)}
							branch=${JSON.stringify(branch)}
						/>
				`
			]
		});
	},
	async addWrapperCommand({ projectDirpath, port }) {
		const replaceInFile = getReplaceInFile({ projectDirpath });
		await addDependency({ packageName: '@tunnel/cli', replaceInFile });
		await replaceInFile({
			files: 'package.json',
			from: outdent`
				"dev": "shopify app dev",
			`,
			to: outdent`
				"dev": "tunnel ${port} -- shopify app dev --port=PORT",
			`
		});
	}
});
