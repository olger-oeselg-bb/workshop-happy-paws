const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ request }) => {
  // reset server state
  await request.post('http://localhost:3000/api/reset')
})

test('pet intake flow - add pet appears in list', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.fill('input[placeholder="https://..."]', 'https://placekitten.com/400/300')
  await page.fill('input[placeholder="https://..."]', 'https://placekitten.com/400/300')
  await page.fill('input', 'Mittens')
  // name field is first input - simple prototype
  await page.fill('input', 'Mittens')
  // type select
  await page.selectOption('select', 'Cat')
  await page.click('text=Save')
  await page.waitForSelector('text=Mittens')
  const card = await page.locator('text=Mittens').first()
  await expect(card).toBeVisible()
})
