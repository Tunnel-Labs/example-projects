import fs from 'node:fs';
import path from 'pathe';
import { monorepoDirpath } from '@-/packages-config';

export function getTestEnvDirpath({
	testPackageSlug
}: {
	testPackageSlug: string;
}) {
	return path.join(monorepoDirpath, 'tests', testPackageSlug, '.test-env');
}

export async function createExampleProjectTestEnv({
	testPackageSlug,
	exampleProjectSlug
}: {
	testPackageSlug: string;
	exampleProjectSlug: string;
}) {
	const exampleProjectDirpath = path.join(
		monorepoDirpath,
		'projects',
		exampleProjectSlug
	);

	// Copy the example project into .test-env/
	const testEnvDirpath = getTestEnvDirpath({ testPackageSlug });
	await fs.promises.cp(exampleProjectDirpath, testEnvDirpath, {
		recursive: true
	});

	return { testEnvDirpath };
}
