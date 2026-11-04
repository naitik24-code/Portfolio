import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const sizes = [1440, 1024, 768, 375, 320];

test('portfolio renders without horizontal overflow and saves review screenshots', async ({ page }) => {
  await mkdir(path.join(process.cwd(), 'qa', 'screenshots'), { recursive: true });
  for (const width of sizes) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    for (const mode of ['3d', 'simple'] as const) {
      const isSimple = await page.locator('.simple-view').count();
      if (mode === 'simple' && !isSimple) await page.locator('.view-toggle').click();
      if (mode === '3d' && isSimple) {
        const toggle = page.locator('.view-toggle');
        if (await toggle.count()) await toggle.click();
      }
      await page.evaluate(() => document.querySelectorAll('.reveal').forEach((section) => section.classList.add('visible')));
      await page.waitForTimeout(850);
      const overflow = await page.evaluate(() => Array.from(document.body.querySelectorAll<HTMLElement>('*')).map((element) => ({
        name: element.tagName.toLowerCase() + (element.className && typeof element.className === 'string' ? `.${element.className.trim().replaceAll(' ', '.')}` : ''),
        right: Math.round(element.getBoundingClientRect().right),
      })).filter(({ right }) => right > window.innerWidth + 1).slice(0, 12));
      expect(overflow, `horizontal overflow at ${width}px in ${mode} view`).toEqual([]);
      await page.screenshot({ path: path.join('qa', 'screenshots', `${width}-${mode}.png`), fullPage: true, animations: 'disabled' });
    }
  }
});

test('project dialog supports keyboard close and allocation remains at 100 percent', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  const trigger = page.locator('.project-open').first();
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const total = await dialog.locator('.allocation-row > b').allTextContents();
  expect(total.reduce((sum, value) => sum + Number.parseInt(value, 10), 0)).toBe(100);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('axe reports no serious or critical accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach((section) => section.classList.add('visible')));
  await page.waitForTimeout(800);
  for (const mode of ['3D', 'simple'] as const) {
    const isSimple = (await page.locator('.simple-view').count()) > 0;
    if (mode === 'simple' && !isSimple) await page.locator('.view-toggle').click();
    if (mode === '3D' && isSimple) await page.locator('.view-toggle').click();
    const results = await new AxeBuilder({ page }).analyze();
    const severe = results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical');
    expect(severe, `${mode}: ${JSON.stringify(severe.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })))}`).toEqual([]);
  }
});
