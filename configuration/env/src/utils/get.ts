import { monorepoDirpath } from '@-/packages-config';
import dotenv from 'dotenv';
import fs from 'node:fs';
import onetime from 'onetime';
import path from 'pathe';
import { envVariablesSchema } from '../schemas/variables.ts';

export const getEnvVariables = onetime(async () => {
	const envFilepath = path.join(monorepoDirpath, '.env');
	if (!fs.existsSync(envFilepath)) {
		throw new Error('.env file not found in @-/monorepo root');
	}

	const envFileContents = await fs.promises.readFile(envFilepath);
	const envVariables = envVariablesSchema.parse(dotenv.parse(envFileContents));
});
