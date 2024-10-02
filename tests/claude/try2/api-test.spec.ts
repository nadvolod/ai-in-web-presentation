import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';
let authToken: string;
let userId: string;
let contactId: string;

test.describe('Contact List API Tests', () => {
  test.beforeAll(async () => {
    // Create a user and get the auth token
    const email = `test${uuidv4()}@example.com`;
    const password = 'TestPassword123!';
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email,
        password,
      }),
    });
    const data = await response.json();
    authToken = data.token;
    userId = data.user._id;
  });

  test.afterAll(async () => {
    // Delete the user
    await fetch(`${BASE_URL}/users/me`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
  });

  test('Add Contact - Success', async () => {
    const response = await fetch(`${BASE_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        birthdate: '1990-01-01',
        email: 'john@example.com',
        phone: '1234567890',
        street1: '123 Main St',
        city: 'Anytown',
        stateProvince: 'CA',
        postalCode: '12345',
        country: 'USA',
      }),
    });
    expect(response.status).toBe(201);
    const data = await response.json();
    contactId = data._id;
    expect(data.firstName).toBe('John');
    expect(data.lastName).toBe('Doe');
  });

  test('Get Contact List', async () => {
    const response = await fetch(`${BASE_URL}/contacts`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test('Get Contact - Success', async () => {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data._id).toBe(contactId);
  });

  test('Update Contact - Success', async () => {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Jane',
        lastName: 'Doe',
      }),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.firstName).toBe('Jane');
    expect(data.lastName).toBe('Doe');
  });

  test('Delete Contact - Success', async () => {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    expect(response.status).toBe(200);
  });

  // Edge Cases
  test('Add Contact - Missing Required Fields', async () => {
    const response = await fetch(`${BASE_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'John',
        // Missing lastName
      }),
    });
    expect(response.status).toBe(400);
  });

  test('Get Non-existent Contact', async () => {
    const response = await fetch(`${BASE_URL}/contacts/nonexistentid`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    expect(response.status).toBe(404);
  });

  // Security Tests
  test('Access Without Authentication', async () => {
    const response = await fetch(`${BASE_URL}/contacts`);
    expect(response.status).toBe(401);
  });

  test('Access With Invalid Token', async () => {
    const response = await fetch(`${BASE_URL}/contacts`, {
      headers: { 'Authorization': 'Bearer invalidtoken' },
    });
    expect(response.status).toBe(401);
  });

  test('Add Contact with XSS Payload', async () => {
    const response = await fetch(`${BASE_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: '<script>alert("XSS")</script>',
        lastName: 'Doe',
        email: 'xss@example.com',
      }),
    });
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.firstName).not.toContain('<script>');
  });

  // User Management Tests
  test('Create User - Success', async () => {
    const email = `newuser${uuidv4()}@example.com`;
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'New',
        lastName: 'User',
        email,
        password: 'NewPassword123!',
      }),
    });
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.user.email).toBe(email);
    // Clean up: delete the new user
    await fetch(`${BASE_URL}/users/me`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${data.token}` },
    });
  });

  test('Login User - Success', async () => {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'TestPassword123!',
      }),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.token).toBeDefined();
  });

  test('Logout User - Success', async () => {
    const response = await fetch(`${BASE_URL}/users/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    expect(response.status).toBe(200);
  });

  // Accessibility considerations
  test('Response Headers for Accessibility', async () => {
    const response = await fetch(`${BASE_URL}/contacts`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    expect(response.headers.get('content-type')).toContain('application/json');
    // Check for CORS headers if applicable
    // expect(response.headers.get('access-control-allow-origin')).toBe('*');
  });

  // Rate Limiting Test
  test('Rate Limiting', async () => {
    const requests = Array(100).fill(null).map(() => 
      fetch(`${BASE_URL}/contacts`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      })
    );
    const responses = await Promise.all(requests);
    const tooManyRequests = responses.filter(r => r.status === 429);
    expect(tooManyRequests.length).toBeGreaterThan(0);
  });
});
