import { chromium } from '@playwright/test';

export default async () => {
	global.browser = await chromium.launch({ headless: false });
	return () => {
		return global.browser.close();
	};
};
