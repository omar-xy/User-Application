# User Application

This project is a **User Application** built with a **Node.js backend** and a **Next.js frontend**. It allows you to manage and display a list of users with pagination.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
   - [Environment Variables](#environment-variables)
   - [Install Makefile](#install-makefile)
3. [Running the Application](#running-the-application)
   - [Backend](#backend)
   - [Frontend](#frontend)
4. [Pagination and Response Handling](#pagination-and-response-handling)
   - [Requesting Users](#requesting-users)
   - [Expected Payload](#expected-payload)
---

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (Node Package Manager)
- **Docker** (for running the PostgreSQL database)
- **Make** (for running commands via the `Makefile`)

---

## Setup

### Environment Variables

1. Create a `.env` file in the root of the project using the provided template:

   ```bash
   cp .env.template .env
2. Update the   `.env` file with your PostgreSQL credentials

3. Copy the same `.env` in the root of `Backend/source` dir.


### .env
```ini
# PostgreSQL credentials
POSTGRES_USER=******
POSTGRES_PASSWORD=******
POSTGRES_DB=******

# Prisma database URL
DATABASE_URL=postgresql://******:******@localhost:5432/******
```

---

## Install Makefile

If `make` is not installed on your Linux/Unix system, install it using your package manager:

### Debian/Ubuntu:

```bash
sudo apt install make
```

### macOS (using Homebrew):

```bash
brew install make
```

---

## Running the Application

### Backend

Start the PostgreSQL database:

```bash
make up
```

Run the backend setup (install dependencies, generate Prisma client, run migrations, and seed the database):

```bash
make setup-backend
```

The backend will automatically start after the setup is complete.

The backend will run on [http://localhost:3001](http://localhost:3001).

### Frontend

Run the frontend setup (install dependencies and build the frontend):

```bash
make setup-frontend
```

The frontend will automatically start after the setup is complete.

The frontend will run on [http://localhost:3000](http://localhost:3000).

---

## Pagination and Response Handling

### Requesting Users

The backend supports pagination for fetching users. You can request users with the following query parameter:

- **page**: The page number (default: 1).

#### Example Request:

```http
GET /users?page=1
```

#### Expected Response Payload:

```json
{
  "users": [
    {
      "id": 1,
      "name": "JohnDoe",
      "createdAt": "2023-10-30T12:34:56.789Z"
    },
    {
      "id": 2,
      "name": "JaneSmith",
      "createdAt": "2023-10-30T12:35:10.123Z"
    }
  ]
}
```

### How We Handled the Response

#### Backend:

- Uses Prisma to query the database with pagination.
- `skip` and `take` parameters are used for pagination.
- `skip` value is calculated as `(page - 1) * take`, where `take` is the number of users per page (default: 10).
- `orderBy` parameter ensures users are returned in alphabetical order by name.

#### How It Works:

1. **Calculate skip and take:**
   - `page`: The page number requested by the client (default: 1).
   - `take`: The number of users to return per page (fixed at 10).
   - `skip`: The number of users to skip, calculated as `(page - 1) * take`.

   **For example:**
   - If `page = 1`, then `skip = 0` and `take = 10`. This returns the first 10 users.
   - If `page = 2`, then `skip = 10` and `take = 10`. This returns the next 10 users.

2. **Query the Database:**
   - The `findMany` method is used to fetch users from the database.
   - The `skip` parameter ensures that the query skips the first `skip` users.
   - The `take` parameter limits the result to the next `take` users.
   - The `orderBy` parameter ensures that users are returned in alphabetical order by name.

#### Frontend:

- Uses infinite scrolling to load more users dynamically.
- The `page` state is incremented to fetch the next set of users.



#### Happy Scrolling 🥂☑️
