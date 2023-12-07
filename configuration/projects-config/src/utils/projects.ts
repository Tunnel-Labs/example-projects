import fs from 'node:fs';
import { monorepoDirpath } from '@-/packages-config';
import path from 'pathe';

export function getExampleProjectsDirpath() {
	return path.join(monorepoDirpath, 'example-projects/projects');
}

export async function getExampleProjects() {
	const exampleProjectsDirpath = getExampleProjectsDirpath();

	const exampleProjectSlugs = await fs.promises.readdir(exampleProjectsDirpath);
	return Object.fromEntries(
		exampleProjectSlugs.map((exampleProjectSlug) => [
			exampleProjectSlug,
			{
				dirpath: path.join(exampleProjectsDirpath, exampleProjectSlug)
			}
		])
	);
}
