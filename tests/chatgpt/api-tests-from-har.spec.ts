import { expect, request, test } from "@playwright/test";

test.describe("API Tests using HAR file", () => {
  let context;

  test.beforeAll(async ({ playwright }) => {
    // Create new request context with the base URL
    context = await request.newContext({
      baseURL: "https://www.saucedemo.com",
    });
  });

  test.afterAll(async () => {
    await context.dispose();
  });

  // Positive Test: Validate 200 status and content-type
  test("GET request to homepage should return 200 status", async () => {
    const response = await context.get("/");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/html");
  });

  // Negative Test: Invalid page should return 404
  test("GET request to invalid page should return 404", async () => {
    const response = await context.get("/non-existent-page");
    expect(response.status()).toBe(404);
  });

  // Boundary Test: Large query parameter
  test("GET request with large query parameter", async () => {
    const largeQuery = "a".repeat(10000); // very large query
    const response = await context.get(`/?q=${largeQuery}`);
    expect(response.status()).toBe(414); // Assuming it should handle large queries
  });

  // Security Test: SQL Injection
  test("GET request with SQL injection attempt", async () => {
    const sqlInjectionQuery = "' OR 1=1; --";
    const response = await context.get(`/?q=${sqlInjectionQuery}`);
    expect(response.status()).not.toBe(500); // Ensure no server crash
  });

  // Security Test: XSS Injection
  test("GET request with XSS attempt", async () => {
    const xssQuery = "<script>alert(1)</script>";
    const response = await context.get(`/?q=${xssQuery}`);
    expect(response.status()).not.toBe(500); // Ensure no server crash
  });

  // Test for CORS header presence
  test("CORS headers should allow all origins", async () => {
    const response = await context.get("/");
    expect(response.headers()["access-control-allow-origin"]).toBe("*");
  });
});
