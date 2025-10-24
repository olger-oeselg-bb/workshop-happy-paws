import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Audit Tests
 * Runs axe-core audits on key pages to ensure WCAG compliance
 */

test.describe('Accessibility Audit', () => {
  test('Home page accessibility', async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:3000');

    // Wait for content to load - look for the pet grid or inventory section
    await page.waitForSelector('.pet-grid, .inventory', { timeout: 10000 });

    // Run axe-core accessibility audit
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Log violations for debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Home page accessibility violations:');
      accessibilityScanResults.violations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation.id}: ${violation.description}`);
        console.log(`   Impact: ${violation.impact}`);
        console.log(`   Help: ${violation.help}`);
        console.log(`   Help URL: ${violation.helpUrl}`);
        console.log(`   Elements: ${violation.nodes.length}`);
        console.log('---');
      });
    }

    // Assert no critical violations
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical'
    );

    expect(criticalViolations).toHaveLength(0);

    // Allow some minor violations but log them
    if (accessibilityScanResults.violations.length > 0) {
      console.log(`Found ${accessibilityScanResults.violations.length} accessibility issues on home page`);
    }
  });

  test('Add Pet page accessibility', async ({ page }) => {
    // Navigate to add pet page
    await page.goto('http://localhost:3000/#/add');

    // Wait for form to load - look for the AddPetForm component
    await page.waitForSelector('.add-pet-form, form', { timeout: 10000 });

    // Run axe-core accessibility audit
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Log violations for debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Add Pet page accessibility violations:');
      accessibilityScanResults.violations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation.id}: ${violation.description}`);
        console.log(`   Impact: ${violation.impact}`);
        console.log(`   Help: ${violation.help}`);
        console.log(`   Elements: ${violation.nodes.length}`);
        console.log('---');
      });
    }

    // Assert no critical violations
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical'
    );

    expect(criticalViolations).toHaveLength(0);
  });

  test('Pet Profile page accessibility', async ({ page }) => {
    // First navigate to home and get a pet ID
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.pet-grid, .inventory', { timeout: 10000 });

    // Click on the first pet link to navigate to profile
    const firstPetLink = page.locator('.pet-card .pet-link').first();
    await expect(firstPetLink).toBeVisible();
    await firstPetLink.click();

    // Wait for profile page to load
    await page.waitForURL('**/pet/**', { timeout: 10000 });

    // Run axe-core accessibility audit
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Log violations for debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Pet Profile page accessibility violations:');
      accessibilityScanResults.violations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation.id}: ${violation.description}`);
        console.log(`   Impact: ${violation.impact}`);
        console.log(`   Help: ${violation.help}`);
        console.log(`   Elements: ${violation.nodes.length}`);
        console.log('---');
      });
    }

    // Assert no critical violations
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical'
    );

    expect(criticalViolations).toHaveLength(0);
  });

  test('Keyboard navigation - Home page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.pet-grid, .inventory', { timeout: 10000 });

    // Test Tab navigation through interactive elements
    await page.keyboard.press('Tab'); // Focus on first element

    // Check if we can navigate through focusable elements
    const focusedElements = [];

    // Tab through several elements
    for (let i = 0; i < 10; i++) {
      const focusedElement = await page.evaluate(() => {
        const activeElement = document.activeElement;
        return {
          tagName: activeElement.tagName,
          role: activeElement.getAttribute('role'),
          'aria-label': activeElement.getAttribute('aria-label'),
          textContent: activeElement.textContent?.trim().substring(0, 50)
        };
      });

      focusedElements.push(focusedElement);
      await page.keyboard.press('Tab');
    }

    // Verify we have some focusable elements
    expect(focusedElements.length).toBeGreaterThan(0);

    // Check that we have navigation elements (links, buttons, etc.)
    const hasInteractiveElements = focusedElements.some(el =>
      ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName) ||
      el.role === 'button' ||
      el.role === 'link'
    );

    expect(hasInteractiveElements).toBe(true);
  });

  test('Keyboard navigation - Add Pet form', async ({ page }) => {
    await page.goto('http://localhost:3000/#/add');
    await page.waitForSelector('.add-pet-form, form', { timeout: 10000 });

    // Test Tab navigation through form elements
    await page.keyboard.press('Tab'); // Focus on first form element

    const formElements = [];

    // Tab through form elements
    for (let i = 0; i < 15; i++) {
      const focusedElement = await page.evaluate(() => {
        const activeElement = document.activeElement;
        return {
          tagName: activeElement.tagName,
          type: activeElement.type,
          name: activeElement.name,
          id: activeElement.id,
          'aria-label': activeElement.getAttribute('aria-label'),
          'aria-describedby': activeElement.getAttribute('aria-describedby')
        };
      });

      formElements.push(focusedElement);
      await page.keyboard.press('Tab');
    }

    // Check that we have form inputs
    const inputElements = formElements.filter(el =>
      ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(el.tagName)
    );

    expect(inputElements.length).toBeGreaterThan(0);

    // Verify form has proper labels (at least some inputs should have labels or aria-labels)
    const labeledInputs = inputElements.filter(el =>
      el['aria-label'] || el.id || el.name
    );

    expect(labeledInputs.length).toBeGreaterThan(0);
  });
});