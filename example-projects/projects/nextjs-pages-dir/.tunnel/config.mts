import { cli } from '@-/cli-helpers';
import { defineProjectConfig } from '@-/projects-config';
import { outdent } from 'outdent';
import path from 'pathe';
import {
	addDependency,
	getReplaceInFile
} from '../../../src/utils/get-script-tag.ts';

export default defineProjectConfig({
	port: 3000,
	async install() {
		await cli.npm('install', {
			cwd: this.fixtureDirpath
		});
	},
	async getStartCommand() {
		return `${await cli.pnpm.getExecutablePath()} run dev`;
	},
	async addScriptTag({ projectDirpath, branch, projectId }) {
		const replaceInFile = getReplaceInFile({ projectDirpath });
		await addDependency({ replaceInFile, packageName: '@tunnel/nextjs' });
		await replaceInFile({
			files: 'app/layout.tsx',
			from: [/^/, '<html lang="en">'],
			to: [
				"import { TunnelToolbar } from '@tunnel/nextjs'",
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
