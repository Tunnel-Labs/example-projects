import { cli } from '@-/cli-helpers';
import { defineProjectConfig } from '~/utils/project.ts';

export default defineProjectConfig({
	port: 8000,
	async install() {
		await cli.npm('install', {
			cwd: this.fixtureDirpath
		});
	},
	async getStartCommand() {
		return `${await cli.pnpm.getExecutablePath()} run start`;
	}
});
