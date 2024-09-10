import { expect, test } from "@playwright/test";

const baseURL = "https://thinking-tester-contact-list.herokuapp.com";
const token = "your_token_here"; // Replace with dynamic token if available

test.describe("Contact API Tests", () => {
  // Add Contact Test
  test("should add a new contact successfully", async ({ request }) => {
    const newContact = {
      firstName: "John",
      lastName: "Doe",
      birthdate: "1970-01-01",
      email: "jdoe@fake.com",
      phone: "8005555555",
      street1: "1 Main St.",
      street2: "Apartment A",
      city: "Anytown",
      stateProvince: "KS",
      postalCode: "12345",
      country: "USA",
    };

    const response = await request.post(`${baseURL}/contacts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: newContact,
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.firstName).toBe(newContact.firstName);
  });

  // Get Contact List
  test("should get the contact list", async ({ request }) => {
    const response = await request.get(`${baseURL}/contacts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const contacts = await response.json();
    expect(contacts.length).toBeGreaterThan(0);
  });

  // Get Contact by ID
  test("should get a single contact by ID", async ({ request }) => {
    const contactId = "6085a221fcfc72405667c3d4"; // Use dynamic or previously created ID

    const response = await request.get(`${baseURL}/contacts/${contactId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const contact = await response.json();
    expect(contact._id).toBe(contactId);
  });

  // Update Contact (PUT)
  test("should update an existing contact", async ({ request }) => {
    const contactId = "6085a221fcfc72405667c3d4"; // Update with dynamic ID
    const updatedContact = {
      firstName: "Amy",
      lastName: "Miller",
      birthdate: "1992-02-02",
      email: "amiller@fake.com",
      phone: "8005554242",
      street1: "13 School St.",
      city: "Washington",
      stateProvince: "QC",
      postalCode: "A1A1A1",
      country: "Canada",
    };

    const response = await request.put(`${baseURL}/contacts/${contactId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: updatedContact,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.firstName).toBe(updatedContact.firstName);
  });

  // Delete Contact
  test("should delete a contact", async ({ request }) => {
    const contactId = "6085a221fcfc72405667c3d4"; // Update with dynamic ID

    const response = await request.delete(`${baseURL}/contacts/${contactId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.text();
    expect(responseBody).toBe("Contact deleted");
  });
});
