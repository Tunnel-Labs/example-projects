import { Browser, BrowserContext } from 'playwright';

export interface GlobalThis {
	browser: Browser;
	browserContext: BrowserContext;
}
