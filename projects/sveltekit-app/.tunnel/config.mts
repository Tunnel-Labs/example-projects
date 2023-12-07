import { cli } from '@-/cli-helpers';
import { defineProjectConfig } from '@-/projects-config';

export default defineProjectConfig({
	port: 5173,
	async install() {
		await cli.npm('install', {
			cwd: this.fixtureDirpath
		});
	},
	async getStartCommand() {
		return `${await cli.pnpm.getExecutablePath()} run dev`;
	}
});
