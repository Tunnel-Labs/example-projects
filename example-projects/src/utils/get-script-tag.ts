import path from 'pathe';
import { ReplaceInFileConfig, replaceInFile } from 'replace-in-file';
import type { ReplaceInFile } from '../types/replace-in-file.ts';

export function getReplaceInFile({
	projectDirpath
}: {
	projectDirpath: string;
}): ReplaceInFile {
	return (config: ReplaceInFileConfig) =>
		replaceInFile({
			...config,
			files: [config.files]
				.flat()
				.map((file) => path.join(projectDirpath, file))
		});
}

export async function addDependency({
	replaceInFile,
	packageName
}: {
	replaceInFile: ReplaceInFile;
	packageName: string;
}) {
	await replaceInFile({
		files: 'package.json',
		from: '"dependencies": {',
		to: `"dependencies": {\n    "${packageName}": "*",`
	});
}
