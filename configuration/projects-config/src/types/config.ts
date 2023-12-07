export interface ProjectConfig {
	fixtureDirpath: string;
	install(this: ProjectConfig): Promise<void>;
	getStartCommand(
		this: ProjectConfig,
		args: { port: number }
	): Promise<{
		command: string;
		env: Record<string, string>;
	}>;
	addScriptTag(args: {
		projectDirpath: string;
		projectId: string;
		branch: string;
	}): Promise<void>;
}
