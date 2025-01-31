# Newsletter Signup API 🚀

## Overview 📝

A Node.js Express API that handles newsletter signups using the MailChimp Marketing API. This service provides a simple way to manage newsletter subscriptions with proper error handling and input validation.

## Features ✨

- **JSON-based RESTful API** endpoints
- **Input validation** and sanitization
- **Error handling**
- **MailChimp integration**
- **Environment-based** configuration

## Prerequisites 📋

- Node.js (v14 or higher)
- npm or yarn
- MailChimp account with API credentials

## Installation 🛠️

### 1. Clone the repository

```bash
git clone https://github.com/remioluwatomi/newsletter-signup.git
cd newsletter-signup
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```env
MAIL_CHIMP_KEY=your_mailchimp_api_key
MAIL_CHIMP_ID=your_mailchimp_list_id
MAIL_CHIMP_SERVER=your_mailchimp_server_prefix
PORT=3000 # Optional, defaults to 3000
```

## Configuration ⚙️

The application requires the following environment variables:

| Variable            | Description                                | Required |
| ------------------- | ------------------------------------------ | -------- |
| `MAIL_CHIMP_KEY`    | Your MailChimp API key                     | Yes      |
| `MAIL_CHIMP_ID`     | Your MailChimp audience/list ID            | Yes      |
| `MAIL_CHIMP_SERVER` | Your MailChimp server prefix (e.g., 'us1') | Yes      |
| `PORT`              | Server port number (defaults to 3000)      | No       |

## Usage 📚

### Starting the Server

```bash
npm start
```

### API Endpoints

#### GET /signup

Returns status of signup endpoint.

**Response:**

```json
{
  "success": true,
  "message": "Signup endpoint ready to receive POST requests"
}
```

#### POST /signup

Subscribes a new user to the newsletter.

**Request Body:**

```json
{
  "email": "user@example.com",
  "fname": "John",
  "lname": "Doe"
}
```

**Successful Response (200):**

```json
{
  "success": true,
  "message": "Successfully subscribed to the newsletter",
  "data": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Response (400/500):**

```json
{
  "success": false,
  "message": "Error message here",
  "code": "ERROR_CODE"
}
```

## Error Handling 🚨

The API includes error handling for:

- Invalid input data
- MailChimp API errors
- Server errors
- Missing environment variables

## Development 💻

### Project Structure

```
├── public/
│   └── signup.html      # Static signup page (Note this is optional - Service can be interacted with via tools like postman)
├── .env                 # Environment variables
├── .gitignore
├── package.json
├── README.md
└── app.js           # App Entry
```

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.
