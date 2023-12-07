import type { ProjectConfig } from '../types/config.ts';

export function defineProjectConfig(
	projectConfig: Omit<ProjectConfig, 'fixtureDirpath'>
) {
	return projectConfig;
}
