import { expect, test } from "@playwright/test";

const baseURL = "https://thinking-tester-contact-list.herokuapp.com";
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmRlZjZlMzZlZGJhZjAwMTM1M2MwOTQiLCJpYXQiOjE3MjU4ODgyMjd9.23xi8HSvnXclilrQ-k0LdzGWp07c0vt96kRHPNpuZDg";

test.describe("User API Tests", () => {
  // Log In User
  test("should log in user and receive a token", async ({ request }) => {
    const credentials = {
      email: "me3@gmail.com",
      password: "myPassword",
    };

    const response = await request.post(`${baseURL}/users/login`, {
      data: credentials,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.token).toBeTruthy();
    token = responseBody.token; // Save token for future requests
  });

  // Add User Test
  test("should add a new user successfully", async ({ request }) => {
    const newUser = {
      firstName: "Test",
      lastName: "User",
      email: "test2@fake.com",
      password: "myPassword",
    };

    const response = await request.post(`${baseURL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: newUser,
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.user.firstName).toBe(newUser.firstName);
  });

  // Update User
  test("should update the current user", async ({ request }) => {
    const updatedUser = {
      firstName: "Updated",
      lastName: "User",
      email: "updated@fake.com",
      password: "newPassword",
    };

    const response = await request.patch(`${baseURL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: updatedUser,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.firstName).toBe(updatedUser.firstName);
  });

  // Delete User
  test("should delete the current user", async ({ request }) => {
    const response = await request.delete(`${baseURL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
  });
});
