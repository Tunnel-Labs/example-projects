import { StartCommand } from './command.ts';

export interface ProjectConfig {
	install(args: { projectDirpath: string }): Promise<void>;
	getStartCommand(args: { port: number }): Promise<StartCommand>;
	addScriptTag(args: {
		projectDirpath: string;
		projectId: string;
		branch: string;
	}): Promise<void>;
	addWrapperCommand(args: {
		projectDirpath: string;
		port?: number;
	}): Promise<void | StartCommand>;
}
