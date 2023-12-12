export interface ProjectConfig {
	install(args: { projectDirpath: string }): Promise<void>;
	getStartCommand(args: { port: number }): Promise<{
		command: string;
		env: Record<string, string>;
	}>;
	addScriptTag(args: {
		projectDirpath: string;
		projectId: string;
		branch: string;
	}): Promise<void>;
}
