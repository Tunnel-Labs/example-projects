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
			env: {
				PORT: String(port)
			}
		};
	},
	async addScriptTag({ projectDirpath, branch, projectId }) {
		const replaceInFile = getReplaceInFile({ projectDirpath });
		await addDependency({ replaceInFile, packageName: '@tunnel/nextjs' });
		await replaceInFile({
			files: 'app/layout.tsx',
			from: [/^/, '<body className={inter.className}>{children}</body>'],
			to: [
				"import { TunnelToolbar } from '@tunnel/nextjs'\n",
				outdent`
					<body className={inter.className}>
						<TunnelToolbar
							projectId=${JSON.stringify(projectId)}
							branch=${JSON.stringify(branch)}
						/>
						{children}
					</body>
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
				"dev": "next dev",
			`,
			to: outdent`
				"dev": "tunnel ${port} -- next dev --port=PORT",
			`
		});
	}
});
