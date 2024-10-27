import { expect, request, test } from "@playwright/test";

const BASE_URL = "https://www.saucedemo.com";

// Utility functions for API state management
async function setupAppState(apiRequest: any) {
  // Example setup: Add item to the cart
  await apiRequest.post(`${BASE_URL}/api/cart/add`, {
    data: { itemId: "sauce-labs-onesie" },
  });
}

async function cleanupAppState(apiRequest: any) {
  // Example cleanup: Empty the cart
  await apiRequest.post(`${BASE_URL}/api/cart/clear`);
}

// Comprehensive E2E and API Test Suite
test.describe("SauceDemo Comprehensive E2E Tests", () => {
  let apiRequestContext;

  test.beforeAll(async ({ playwright }) => {
    apiRequestContext = await request.newContext({ baseURL: BASE_URL });
  });

  test.afterAll(async () => {
    await apiRequestContext.dispose();
  });

  test.beforeEach(async () => {
    await setupAppState(apiRequestContext);
  });

  test.afterEach(async () => {
    await cleanupAppState(apiRequestContext);
  });

  test("User should be able to login and add an item to the cart", async ({
    page,
  }) => {
    // Navigate to the login page
    await page.goto(BASE_URL);

    // Perform login
    await page.fill("input[data-test='username']", "standard_user");
    await page.fill("input[data-test='password']", "secret_sauce");
    await page.click("input[data-test='login-button']");

    // Verify login success by checking the presence of a product
    await expect(page.locator(".inventory_item")).toBeVisible();

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
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

    // Finish checkout
    await page.click("button[data-test='finish']");

    // Verify checkout completion
    await expect(page.locator(".complete-header")).toHaveText(
      "THANK YOU FOR YOUR ORDER"
    );
  });

  test("API Test - Verify item can be added and removed from cart", async () => {
    // Add item to the cart via API
    const addResponse = await apiRequestContext.post("/api/cart/add", {
      data: { itemId: "sauce-labs-backpack" },
    });
    expect(addResponse.ok()).toBeTruthy();

    // Verify item is in the cart
    const cartResponse = await apiRequestContext.get("/api/cart");
    const cartData = await cartResponse.json();
    expect(cartData.items).toContainEqual(
      expect.objectContaining({ itemId: "sauce-labs-backpack" })
    );

    // Remove item from cart via API
    const removeResponse = await apiRequestContext.post("/api/cart/remove", {
      data: { itemId: "sauce-labs-backpack" },
    });
    expect(removeResponse.ok()).toBeTruthy();

    // Verify cart is empty
    const updatedCartResponse = await apiRequestContext.get("/api/cart");
    const updatedCartData = await updatedCartResponse.json();
    expect(updatedCartData.items).toEqual([]);
  });

  test("E2E Test - User should be able to logout successfully", async ({
    page,
  }) => {
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
