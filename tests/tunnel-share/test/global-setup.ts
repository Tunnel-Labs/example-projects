import { cli } from '@-/cli-helpers';

globalThis.loginPromise ??= (async () => {
	await cli.tunnel(
		['login', `--api-key=${process.env.TUNNEL_TEST_USER_API_KEY}`],
		{ stdio: 'inherit' }
	);
})();

await globalThis.loginPromise;
