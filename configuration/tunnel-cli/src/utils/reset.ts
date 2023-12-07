import fs from 'node:fs';
import os from 'node:os';
import path from 'pathe';

/**
	Resets the state of the Tunnel CLI
*/
export async function resetTunnelCli() {
	await fs.promises.rm(path.join(os.homedir(), '.tunnel', 'storage.staging.json'));
}
