export interface ProjectConfig {
	port: number;
	fixtureDirpath: string;
	install(this: ProjectConfig): Promise<void>;
	getStartCommand(this: ProjectConfig): Promise<string>;
	addScriptTag(args: {
		projectDirpath: string;
		projectId: string;
		branch: string;
	}): Promise<void>;
}
