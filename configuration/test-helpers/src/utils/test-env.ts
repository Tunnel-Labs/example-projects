import fs from 'node:fs';
import path from 'pathe';
import { monorepoDirpath } from '@-/packages-config';
import { getExampleProjectsDirpath } from '@-/projects-config';

export function getTestPackageTestEnvDirpath({
	testPackageSlug
}: {
	testPackageSlug: string;
}) {
	return path.join(monorepoDirpath, 'tests', testPackageSlug, '.test-env');
}

export function getExampleProjectTestEnvDirpath({
	testPackageSlug,
	exampleProjectSlug
}: {
	testPackageSlug: string;
	exampleProjectSlug: string;
}) {
	return path.join(
		getTestPackageTestEnvDirpath({ testPackageSlug }),
		exampleProjectSlug
	);
}

export async function createExampleProjectTestEnv({
	testPackageSlug,
	exampleProjectSlug
}: {
	testPackageSlug: string;
	exampleProjectSlug: string;
}) {
	const exampleProjectDirpath = path.join(
		getExampleProjectsDirpath(),
		exampleProjectSlug
	);

	const testPackageTestEnvDirpath = getTestPackageTestEnvDirpath({
		testPackageSlug
	});
	await fs.promises.mkdir(testPackageTestEnvDirpath, { recursive: true });
	await fs.promises.writeFile(
		path.join(testPackageTestEnvDirpath, 'package.json'),
		JSON.stringify({ type: 'commonjs' })
	);

	const exampleProjectTestEnvDirpath = getExampleProjectTestEnvDirpath({
		testPackageSlug,
		exampleProjectSlug
	});
	await fs.promises.rm(exampleProjectTestEnvDirpath, {
		recursive: true,
		force: true
	});
	await fs.promises.cp(exampleProjectDirpath, exampleProjectTestEnvDirpath, {
		recursive: true
	});

	return { testEnvDirpath: exampleProjectTestEnvDirpath };
}
