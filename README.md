# Contact List API Test Suite

## Project Overview

This project contains a comprehensive test suite for the Contact List API, which is hosted at https://thinking-tester-contact-list.herokuapp.com. The test suite is written in TypeScript using Playwright and Axios for making HTTP requests.

## Features

The test suite covers the following main features of the Contact List API:

1. User Management

   - User registration
   - User login
   - User profile retrieval
   - User profile update
   - User logout
   - User deletion

2. Contact Management
   - Adding a new contact
   - Retrieving the contact list
   - Getting a specific contact
   - Updating a contact (full update)
   - Partially updating a contact
   - Deleting a contact

## Prerequisites

To run this test suite, you need to have the following installed:

- Node.js (version 12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install the dependencies by running:

## Configuration

The base URL for the API is set in the `BASE_URL` constant in the test file. If you need to test against a different environment, update this constant accordingly.

## Running the Tests

To run the entire test suite, use the following command:

## Test Structure

The tests are organized into two main describe blocks:

1. Contact List API Tests
2. User API Tests

Each block contains multiple test cases that cover different aspects of the API functionality.

## Authentication

The test suite handles authentication automatically. It creates a new user before running the tests and uses the generated authentication token for subsequent requests. The user is deleted after all tests are completed.

## Error Handling

The tests use Playwright's built-in assertion library to check for expected responses and data. Any failures will be reported in the test output.

## Contributing

If you want to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes and commit them
4. Push to your fork and submit a pull request

## License

[Include your chosen license here]

## Contact

[Your contact information or where to report issues]
