import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('http://localhost:8787');

  // Click Gemini Gateway
  await page.click('text=Gemini Gateway');

  // Take screenshot of the gateway panel
  await page.screenshot({ path: '/home/jules/verification/gateway_active.png' });

  // Test prompt update
  await page.fill('#gatewayPrompt', 'Coba tes');

  // Wait for URL update
  const urlText = await page.textContent('#gatewayUrlDisplay');
  console.log('Updated URL:', urlText);

  await browser.close();
})();
