import fs from 'node:fs';
import { monorepoDirpath } from '@-/packages-config';
import path from 'pathe';

export async function getExampleProjects() {
	const exampleProjectsDirpath = path.join(monorepoDirpath, 'projects');

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
