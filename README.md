# User Application

This project is a **User Application** built with a **Node.js backend** and a **Next.js frontend**. It allows you to manage and display a list of users with pagination. The application is designed to be **scalable**, **efficient**, and **easy to maintain**, making it suitable for both small and large-scale deployments.

---

## Table of Contents
1. [Features](#features)
2. [Architecture](#architecture)
   - [Monolithic Architecture](#monolithic-architecture)
   - [Simplicity and Scalability](#simplicity-and-scalability)
3. [Tech Stack](#tech-stack)
4. [Prerequisites](#prerequisites)
5. [Setup](#setup)
   - [Environment Variables](#environment-variables)
   - [Install Makefile](#install-makefile)
6. [Running the Application](#running-the-application)
   - [Backend](#backend)
   - [Frontend](#frontend)
7. [Pagination and Response Handling](#pagination-and-response-handling)
   - [Requesting Users](#requesting-users)
   - [Expected Payload](#expected-payload)

---

## Features

- **User Management**: Add, display, and paginate through a list of users.
- **Pagination**: Efficiently fetch users in chunks to improve performance.
- **Infinite Scrolling**: Load more users as you scroll (frontend implementation).
- **Database Seeding**: Automatically seed the database with initial data from a file.
- **RESTful API**: Backend exposes a clean and well-documented API for user management.

---

## Architecture

### Monolithic Architecture
The application follows a **monolithic architecture**, where the backend and frontend are tightly coupled but logically separated. This approach is ideal for small to medium-sized projects due to its simplicity and ease of deployment.

#### Key Characteristics:
- **Single Codebase**: Both the backend and frontend are part of the same repository.
- **Centralized Database**: A single PostgreSQL database is used to store all user data.
- **RESTful API**: The backend exposes a REST API that the frontend consumes.

#### Benefits:
- **Simplicity**: Easy to develop, test, and deploy.
- **Low Overhead**: No need for complex microservices or distributed systems.
- **Quick Iteration**: Changes can be made and deployed rapidly.

### Simplicity and Scalability
While the application is monolithic, it is designed with scalability in mind:
- **Pagination**: Reduces the load on the database by fetching users in chunks.
- **Efficient Queries**: Uses Prisma’s `skip` and `take` parameters to optimize database queries.
- **Modular Code**: The backend and frontend are logically separated, making it easy to scale or refactor individual components.

---

## Tech Stack

### Backend
- **Node.js**: A fast and scalable runtime for building the backend.
- **Express**: A minimal and flexible web framework for Node.js.
- **Prisma**: A modern ORM for database management and querying.
- **PostgreSQL**: A powerful, open-source relational database.

### Frontend
- **Next.js**: A React framework for building server-rendered and static web applications.
- **Tailwind CSS**: A utility-first CSS framework for styling the frontend.

### Tools
- **Docker**: For containerizing the PostgreSQL database.
- **Makefile**: For automating setup and deployment tasks.
- **TypeScript**: For type-safe development across the entire stack.

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

#### A futuristic, cyberpunk Frontend:

- Uses infinite scrolling to load more users dynamically.
- The `page` state is incremented to fetch the next set of users.



#### Happy Scrolling 🥂☑️
