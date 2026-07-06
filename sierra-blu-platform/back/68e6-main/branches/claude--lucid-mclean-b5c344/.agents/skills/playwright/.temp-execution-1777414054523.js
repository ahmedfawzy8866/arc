
const { chromium, firefox, webkit, devices } = require('playwright');
const helpers = require('./lib/helpers');

// Extra headers from environment variables (if configured)
const __extraHeaders = helpers.getExtraHeadersFromEnv();

/**
 * Utility to merge environment headers into context options.
 * Use when creating contexts with raw Playwright API instead of helpers.createContext().
 * @param {Object} options - Context options
 * @returns {Object} Options with extraHTTPHeaders merged in
 */
function getContextOptionsWithHeaders(options = {}) {
  if (!__extraHeaders) return options;
  return {
    ...options,
    extraHTTPHeaders: {
      ...__extraHeaders,
      ...(options.extraHTTPHeaders || {})
    }
  };
}

(async () => {
  try {
    
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('https://my-app-beta-blond-99.vercel.app/', { waitUntil: 'networkidle', timeout: 30000 });

// Click the Advisor button (4th button on page)
const buttons = await page.locator('button').all();
for (let i = 0; i < buttons.length; i++) {
  const text = await buttons[i].innerText();
  console.log('Button', i, ':', text.trim());
}

// Click the last button (Advisor/Guest)
await buttons[buttons.length - 1].click();
await page.waitForTimeout(4000);

const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 1000));
console.log('After click:', bodyText);
await page.screenshot({ path: '/tmp/vercel-after-login.png', fullPage: false });

await browser.close();

  } catch (error) {
    console.error('❌ Automation error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
})();
