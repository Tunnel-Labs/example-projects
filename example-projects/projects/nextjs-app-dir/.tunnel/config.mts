import { cli } from '@-/cli-helpers';
import { defineProjectConfig } from '@-/projects-config';
import { outdent } from 'outdent';
import {
	addDependency,
	getReplaceInFile
} from '../../../src/utils/get-script-tag.ts';

export default defineProjectConfig({
	async install({ projectDirpath }) {
		await cli.npm('install', { cwd: projectDirpath });
	},
	async getStartCommand({ port }) {
		return {
			command: `${await cli.npm.getExecutablePath()} run dev`,
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
			from: [/^/, '<html lang="en">'],
			to: [
				"import { TunnelToolbar } from '@tunnel/nextjs'\n",
				outdent`
					<html lang="en">
					<head>
						<TunnelToolbar
							projectId=${JSON.stringify(projectId)}
							branch=${JSON.stringify(branch)}
						/>
					</head>
				`
			]
		});
	}
});
