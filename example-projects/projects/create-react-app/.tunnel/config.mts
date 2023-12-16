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
			env: {
				PORT: String(port)
			},
			command: `${await cli.bun.getExecutablePath()} run start`
		};
	},
	async addScriptTag({ projectDirpath, branch, projectId }) {
		const replaceInFile = getReplaceInFile({ projectDirpath });
		await addDependency({ replaceInFile, packageName: '@tunnel/react' });
		await replaceInFile({
			files: 'src/App.js',
			from: [/^/, '<header className="App-header">'],
			to: [
				"import { TunnelToolbar } from '@tunnel/react'\n",
				outdent`
					<header className="App-header">
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
				"start": "BROWSER=none react-scripts start",
			`,
			to: outdent`
				"start": "tunnel ${port} -- BROWSER=none react-scripts start",
			`
		});
	}
});
