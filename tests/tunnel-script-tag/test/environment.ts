import type { Environment } from 'vitest';
import { populateGlobal } from 'vitest/environments';
import { chromium } from '@playwright/test';

export default {
	name: 'playwright',
	transformMode: 'ssr',
	async setup(global) {
		const browser = await chromium.launch({ headless: false });
		populateGlobal({ browser }, global);
		return {
			async teardown() {
				await browser.close();
			}
		};
	}
} satisfies Environment;
