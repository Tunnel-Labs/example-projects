import { cli } from '@-/cli-helpers';
import { defineProjectConfig } from '@-/projects-config';
import {
	addDependency,
	getReplaceInFile
} from '../../../src/utils/get-script-tag.ts';
import { outdent } from 'outdent';

export default defineProjectConfig({
	async install({ projectDirpath }) {
		await cli.npm('install', { cwd: projectDirpath });
	},
	async getStartCommand({ port }) {
		return {
			command: `${await cli.node.getExecutablePath()} server.js`,
			env: { PORT: String(port) }
		};
	},
	async addScriptTag({ projectDirpath, branch, projectId }) {
		const replaceInFile = getReplaceInFile({ projectDirpath });
		await replaceInFile({
			files: 'templates/index.ejs',
			from: '<head>',
			to: outdent`
				<head>
				<script
					src="https://tunnelapp.dev/__tunnel/script.js"
					data-project-id=${JSON.stringify(projectId)}
					data-branch=${JSON.stringify(branch)}
				></script>
			`
		});
	},
	async addWrapperCommand({ projectDirpath, port }) {
		const replaceInFile = getReplaceInFile({ projectDirpath });
		await addDependency({ packageName: '@tunnel/cli', replaceInFile });
		return {
			command: `tunnel ${port} -- ${await cli.node.getExecutablePath()} server.js`,
			env: {}
		};
	}
});
