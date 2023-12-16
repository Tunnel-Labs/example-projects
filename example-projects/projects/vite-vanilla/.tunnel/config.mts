import { cli } from '@-/cli-helpers';
import { defineProjectConfig } from '@-/projects-config';
import {
	addDependency,
	getReplaceInFile
} from '../../../src/utils/get-script-tag.ts';
import { outdent } from 'outdent';

export default defineProjectConfig({
	async install({ projectDirpath }) {
		await cli.bun('install', { cwd: projectDirpath });
	},
	async getStartCommand({ port }) {
		return {
			command: `${await cli.bun.getExecutablePath()} run dev -- --port=${port}`,
			env: {}
		};
	},
	async addScriptTag({ projectDirpath, branch, projectId }) {
		const replaceInFile = getReplaceInFile({ projectDirpath });
		await replaceInFile({
			files: 'index.html',
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
		await replaceInFile({
			files: 'package.json',
			from: outdent`
				"dev": "vite",
			`,
			to: outdent`
				"dev": "tunnel ${port} -- vite",
			`
		});
	}
});
