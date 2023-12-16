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
			env: {
				PORT: String(port)
			},
			command: `${await cli.npm.getExecutablePath()} run dev`,
		}
	},
	async addScriptTag({ projectDirpath, branch, projectId }) {
		const replaceInFile = getReplaceInFile({ projectDirpath });
		await addDependency({ replaceInFile, packageName: '@tunnel/nextjs' });
		await replaceInFile({
			files: 'pages/_app.tsx',
			from: [/^/, 'return <Component {...pageProps} />'],
			to: [
				"import { TunnelToolbar } from '@tunnel/nextjs'\n",
				outdent`
					return (
						<>
							<Component {...pageProps} />
							<TunnelToolbar
								projectId=${JSON.stringify(projectId)}
								branch=${JSON.stringify(branch)}
							/>
						</>
					)
				`
			]
		});
	}
});
