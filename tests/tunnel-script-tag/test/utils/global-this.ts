import { Browser, BrowserContext } from 'playwright';

export function getGlobalThis() {
	return globalThis as unknown as {
		browserContext: BrowserContext;
		browser: Browser;
	};
}
