import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8787');

  // Click on Gemini template
  await page.click('text=Gemini (New)');

  // Check gateway button text update
  await page.click('#gatewayBtn');

  // Wait for response
  await page.waitForTimeout(2000);

  await page.screenshot({ path: '/home/jules/verification/updated_ui.png', fullPage: true });

  // Check if instruction text contains gemini-3
  const instruction = await page.textContent('#instructionText');
  console.log('Instruction:', instruction);

  await browser.close();
})();
