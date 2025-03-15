# My Personal API

This README includes an overview of the API, setup instructions, and examples of all endpoints, with a Postman collection to help you get started.

---

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [API Endpoints](#api-endpoints)
4. [Postman Collection](#postman-collection)
5. [Authentication](#authentication)
6. [Error Handling
   ](#error-handling)

---

## Features {features}

- **JWT Authentication** : Secure authentication for both user and company accounts.
- **Account Customization** : Users and companies can update profiles, including profile pictures, experience, and education.
- **Job Posting** : Companies can create and manage job listings.
- **Job Applications** : Users can apply for jobs with a CV upload.

---

## Installation {installation}

### Prerequisites

- Nodejs (NPM)
- MySQL
- Git

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/NyiZinThant/worknest-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd worknest-api
   ```

3. Install NPM packages:

   ```bash
   npm install
   ```

4. Copy .env file and configure the project based on .env.example

   ```bash
   # Linux, MacOs
   cp .env.example .env
   ```

5. Set up Prisma

   ```bash
   npx prisma generate
   npx prisma migrate deploy

   #seeding the database
   npm run seed
   ```

6. Start the project

```bash
   npm run dev
```

---

## Api Endpoints {api-endpoints}

### Auth > Companies

| Endpoint                        | Method | Description      |
| ------------------------------- | ------ | ---------------- |
| `/api/v1/auth/company/register` | POST   | Register Company |
| `/api/v1/auth/company/login`    | POST   | Login Company    |

### Auth > Users

| Endpoint                     | Method | Description   |
| ---------------------------- | ------ | ------------- |
| `/api/v1/auth/user/register` | POST   | Register User |
| `/api/v1/auth/user/login`    | POST   | Login User    |

### Jobs

| Endpoint                                        | Method | Description             |
| ----------------------------------------------- | ------ | ----------------------- |
| `/api/v1/jobs`                                  | GET    | Get All Jobs            |
| `/api/v1/jobs/{id}`                             | GET    | Get Job By Id           |
| `/api/v1/jobs/`                                 | POST   | Add New Job             |
| `/api/v1/jobs/{id}/job-applications`            | POST   | Add New Job Application |
| `/api/v1/jobs/{id}/job-applications/{resumeId}` | GET    | Download Resume By Id   |

### Employee Types

| Endpoint                 | Method | Description            |
| ------------------------ | ------ | ---------------------- |
| `/api/v1/employee-types` | GET    | Get All Employee Types |

### Work Modes

| Endpoint             | Method | Description       |
| -------------------- | ------ | ----------------- |
| `/api/v1/work-modes` | GET    | Get All Job Modes |

### Users

| Endpoint                | Method | Description                   |
| ----------------------- | ------ | ----------------------------- |
| `/api/v1/users/me`      | GET    | Get Authenticated User Detail |
| `/api/v1/users/{id}`    | GET    | Get User By Id                |
| `/api/v1/users/me`      | PUT    | Update Authenticated User     |
| `/images/{imageId}.jpg` | GET    | Get Profile Image             |
| `/api/v1/users`         | GET    | Get All Users                 |

### Qualifications

| Endpoint                 | Method | Description            |
| ------------------------ | ------ | ---------------------- |
| `/api/v1/qualifications` | GET    | Add New Qualifications |

### Educations

| Endpoint                  | Method | Description       |
| ------------------------- | ------ | ----------------- |
| `/api/v1/educations`      | POST   | Add New Education |
| `/api/v1/educations/{id}` | DELETE | Remove Education  |

### Experiences

| Endpoint                   | Method | Description        |
| -------------------------- | ------ | ------------------ |
| `/api/v1/experiences`      | POST   | Add New Experience |
| `/api/v1/experiences/{id}` | DELETE | Remove Experience  |

### Companies

| Endpoint                 | Method | Description                      |
| ------------------------ | ------ | -------------------------------- |
| `/api/v1/companies/{id}` | GET    | Get Company By Id                |
| `/api/v1/companies/me`   | GET    | Get Authenticated Company Detail |
| `/api/v1/companies/me`   | PUT    | Update Authenticated Company     |

---

## Postman Collection {postman-collection}

[Published Postman Collection]()

---

## Authentication {authentication}

This API uses JWT for authentication. Currently, it doesn't require Authorization header because the tokens are sent as HTTP-only cookies. For the future, it may require Authorization header.

---

## Error Handling {error-handling}

The API returns standard HTTP status codes with JSON responses:

1. `200`: Success
2. `201`: Created
3. `400`: Bad Request
4. `401`: Unauthorized
5. `404`: Not Found
6. `409`: Conflict
7. `500`: Server Error
