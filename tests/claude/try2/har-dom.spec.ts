import { expect, test } from "@playwright/test";

// API Tests
// ChatGPT generated

// 1. Validate homepage GET request
test("API: GET homepage should return 200 and correct headers", async ({
  request,
}) => {
  const response = await request.get("https://www.saucedemo.com/");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/html");
});

// 2. Check for correct response for an API call (example item listing)
test("API: GET item data should return 200 and valid content", async ({
  request,
}) => {
  const response = await request.get("https://www.saucedemo.com/api/inventory");
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data).toHaveProperty("items");
  expect(data.items.length).toBeGreaterThan(0); // Ensure items are available
});

// 3. Rate-limiting test for API (burst requests)
test("API: Test rate limiting with burst requests", async ({ request }) => {
  for (let i = 0; i < 20; i++) {
    const response = await request.get(
      "https://www.saucedemo.com/api/inventory"
    );
    expect(response.status()).toBe(200); // Should handle burst requests properly
  }
});

// E2E Tests

// 1. Test basic navigation and cart functionality
test("E2E: Add an item to the cart and verify it is added", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await page.fill('input[data-test="username"]', "standard_user");
  await page.fill('input[data-test="password"]', "secret_sauce");
  await page.click('input[data-test="login-button"]');

  // Add the backpack to the cart
  await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
  const cartBadge = await page.locator('span[data-test="shopping-cart-badge"]');
  await expect(cartBadge).toHaveText("1");
});

// 2. Test sorting functionality
test("E2E: Verify product sorting by price", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.selectOption('select[data-test="product-sort-container"]', "lohi"); // Sort by price low to high
  const firstPrice = await page
    .locator(".inventory_item_price")
    .first()
    .innerText();
  expect(firstPrice).toBe("$7.99"); // First item should be the lowest price item
});

// Security Tests

// 1. Check for CORS headers
test("Security: Validate CORS headers", async ({ request }) => {
  const response = await request.get("https://www.saucedemo.com/");
  expect(response.headers()["access-control-allow-origin"]).toBe("*");
});

// 2. Verify presence of important security headers
test("Security: Check security headers", async ({ request }) => {
  const response = await request.get("https://www.saucedemo.com/");
  expect(response.headers()).toHaveProperty("strict-transport-security");
  expect(response.headers()).toHaveProperty("content-security-policy");
});

// Edge Case Tests

// // 1. Simulate slow network conditions
// Failed due to invalid api usage of route.continue
// test("Edge Case: Simulate slow network and validate page load", async ({
//   page,
// }) => {
//   await page.route("**/*", (route) => route.continue({ delay: 3000 }));
//   await page.goto("https://www.saucedemo.com/");
//   await expect(page).toHaveTitle(/Swag Labs/); // Page should still load under slow conditions
// });

// 2. Test with a large number of cart items
test("Edge Case: Add many items to the cart", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  for (let i = 0; i < 10; i++) {
    await page.click(`button[data-test="add-to-cart-sauce-labs-backpack"]`);
  }
  const cartBadge = await page.locator('span[data-test="shopping-cart-badge"]');
  await expect(cartBadge).toHaveText("10");
});

// Accessibility Tests

// 1. Validate accessibility of buttons and links
// Outdated APIs page.accessibility.snapshot({ root: loginButton });
// test("Accessibility: Verify accessibility of key elements", async ({
//   page,
// }) => {
//   await page.goto("https://www.saucedemo.com/");
//   const loginButton = await page.locator('input[data-test="login-button"]');
//   const a11ySnapshot = await page.accessibility.snapshot({ root: loginButton });
//   expect(a11ySnapshot).toHaveProperty("name", "Login");
// });
