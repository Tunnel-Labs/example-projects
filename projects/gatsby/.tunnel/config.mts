import { cli } from '@-/cli-helpers';
import { defineProjectConfig } from '@-/projects-config';
import { outdent } from 'outdent';
import path from 'pathe';
import { replaceInFile } from 'replace-in-file';

export default defineProjectConfig({
	port: 8000,
	async install() {
		await cli.npm('install', {
			cwd: this.fixtureDirpath
		});
	},
	async getStartCommand() {
		return `${await cli.pnpm.getExecutablePath()} run start`;
	},
	async addScriptTag({ projectDirpath, branch, projectId }) {
		await replaceInFile({
			files: path.join(projectDirpath, 'package.json'),
			from: '"dependencies": {',
			to: '"dependencies": {\n    "@tunnel/react": "*",'
		});
		await replaceInFile({
			files: path.join(projectDirpath, 'src/App.js'),
			from: [/^/, '<header className="App-header">'],
			to: [
				"import { TunnelToolbar } from '@tunnel/react'",
				outdent`
					<header className="App-header">
					<TunnelToolbar
						projectId=${JSON.stringify(projectId)}
						branch=${JSON.stringify(branch)}
					/>
				`
			]
		});
	}
});
