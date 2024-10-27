import { expect, test } from "@playwright/test";

const BASE_URL = "https://www.saucedemo.com";

test.describe("SauceDemo Comprehensive E2E Tests", () => {
  test("User should be able to login and add an item to the cart", async ({
    page,
  }) => {
    // Navigate to the login page
    await page.goto(BASE_URL);

    // Perform login
    await page.fill("input[data-test='username']", "standard_user");
    await page.fill("input[data-test='password']", "secret_sauce");
    await page.click("input[data-test='login-button']");

    // Verify login success by checking the inventory container is visible
    await expect(page.locator(".inventory_container")).toBeVisible();

    // Add item to cart
    await page.click("button[data-test='add-to-cart-sauce-labs-onesie']");

    // Verify item is added to the cart
    await page.click(".shopping_cart_link");
    await expect(page.locator(".cart_item")).toBeVisible();
  });

  test("User should be able to complete the checkout process", async ({
    page,
  }) => {
    // Navigate to the login page
    await page.goto(BASE_URL);

    // Perform login
    await page.fill("input[data-test='username']", "standard_user");
    await page.fill("input[data-test='password']", "secret_sauce");
    await page.click("input[data-test='login-button']");

    // Add item to cart
    await page.click("button[data-test='add-to-cart-sauce-labs-onesie']");

    // Proceed to checkout
    await page.click(".shopping_cart_link");
    await page.click("button[data-test='checkout']");

    // Fill in checkout information
    await page.fill("input[data-test='firstName']", "Luke");
    await page.fill("input[data-test='lastName']", "Perry");
    await page.fill("input[data-test='postalCode']", "90210");
    await page.click("input[data-test='continue']");

    // Verify checkout overview page
    await expect(page).toHaveURL(/.*checkout-step-two.html/);

    // Finish checkout
    await page.click("button[data-test='finish']");

    // Verify checkout completion with correct case-sensitive text
    await expect(page.locator(".complete-header")).toHaveText(
      "Thank you for your order!"
    );
  });

  test("Cart functionality test", async ({ page }) => {
    // Navigate to the login page
    await page.goto(BASE_URL);

    // Perform login
    await page.fill("input[data-test='username']", "standard_user");
    await page.fill("input[data-test='password']", "secret_sauce");
    await page.click("input[data-test='login-button']");

    // Add item to cart using UI
    await page.click("button[data-test='add-to-cart-sauce-labs-backpack']");

    // Verify item is in the cart
    await page.click(".shopping_cart_link");
    await expect(page.locator(".cart_item")).toBeVisible();

    // Remove item from cart
    await page.click("button[data-test='remove-sauce-labs-backpack']");

    // Verify cart is empty
    await expect(page.locator(".cart_item")).not.toBeVisible();
  });

  test("User should be able to logout successfully", async ({ page }) => {
    // Navigate to the login page
    await page.goto(BASE_URL);

    // Perform login
    await page.fill("input[data-test='username']", "standard_user");
    await page.fill("input[data-test='password']", "secret_sauce");
    await page.click("input[data-test='login-button']");

    // Logout
    await page.click("#react-burger-menu-btn");
    await page.click("#logout_sidebar_link");

    // Verify logout by checking login button is visible again
    await expect(page.locator("input[data-test='login-button']")).toBeVisible();
  });
});
