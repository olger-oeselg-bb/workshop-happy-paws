const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('console', msg => console.log('BROWSER LOG>', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR>', err.message));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  // click the Add Pet button to navigate to the add page
  await page.click('button:has-text("Add Pet")');
  await page.waitForSelector('section.form');

  // fill required fields (name and photo URL to satisfy validation)
  await page.fill('section.form input', 'Test Cat').catch(() => {});
  // attach file to the add page file input
  const input = await page.$('section.form input[type=file]');
  if (!input) {
    console.error('file input not found on add page');
    await browser.close();
    process.exit(2);
  }
  await input.setInputFiles('/tmp/test.png');

  // wait a bit to let client render and observe any console errors
  await page.waitForTimeout(1000);
  console.log('Done waiting after file attach');
  await browser.close();
})();
