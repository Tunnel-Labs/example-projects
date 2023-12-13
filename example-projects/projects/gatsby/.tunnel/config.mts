import { cli } from '@-/cli-helpers';
import { defineProjectConfig } from '@-/projects-config';
import { outdent } from 'outdent';
import {
	addDependency,
	getReplaceInFile
} from '../../../src/utils/get-script-tag.ts';

export default defineProjectConfig({
	async install({ projectDirpath }) {
		await cli.npm('install', {
			cwd: projectDirpath
		});
	},
	async getStartCommand({ port }) {
		return {
			command: `${await cli.npm.getExecutablePath()} run start`,
			env: {
				NODE_ENV: 'development',
				PORT: String(port)
			}
		};
	},
	async addScriptTag({ projectDirpath, branch, projectId }) {
		const replaceInFile = getReplaceInFile({ projectDirpath });
		await addDependency({ replaceInFile, packageName: '@tunnel/react' });
		await replaceInFile({
			files: 'src/pages/index.js',
			from: [/^/, '<main style={pageStyles}>'],
			to: [
				"import { TunnelToolbar } from '@tunnel/react'\n",
				outdent`
					<main style={pageStyles}>
					<TunnelToolbar
						projectId=${JSON.stringify(projectId)}
						branch=${JSON.stringify(branch)}
					/>
				`
			]
		});
	}
});
