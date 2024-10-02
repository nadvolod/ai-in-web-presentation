import { expect, test } from "@playwright/test";

test("Swag Labs Checkout Test", async ({ page, context }) => {
  // Enable HAR recording
  await context.tracing.start({ snapshots: true, screenshots: true });

  // Navigate to the website
  await page.goto("https://www.saucedemo.com/");

  // Login
  await page.fill("#user-name", "standard_user");
  await page.fill("#password", "secret_sauce");
  await page.click("#login-button");

  // Add item to cart
  await page.click("#add-to-cart-sauce-labs-backpack");

  // Go to cart
  await page.click(".shopping_cart_link");

  // Proceed to checkout
  await page.click("#checkout");

  // Fill checkout information
  await page.fill("#first-name", "John");
  await page.fill("#last-name", "Doe");
  await page.fill("#postal-code", "12345");
  await page.click("#continue");

  // Complete order
  await page.click("#finish");

  // Verify order completion
  await expect(page.locator(".complete-header")).toHaveText(
    "Thank you for your order!"
  );
  await page.waitForTimeout(5000); // Wait 5 seconds before stoppin
  // Stop HAR recording and save the file
  await context.tracing.stop({ path: "checkout_test.har" });
});
