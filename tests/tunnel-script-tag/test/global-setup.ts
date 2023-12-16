import { chromium } from 'playwright';

if (!globalThis.setup) {
	globalThis.setup = true;
	const browser = await chromium.launch({ headless: false });
	const browserContext = await browser.newContext();

	globalThis.browser = browser;
	globalThis.browserContext = browserContext;
}
