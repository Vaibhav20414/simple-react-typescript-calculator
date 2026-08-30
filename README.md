# Full-Stack Calculator

A full-stack calculator application built from scratch to learn and implement the fundamentals of modern web application development.

The project started as a simple calculator and evolved into a persistent, multi-user application with a React frontend, Node.js backend, PostgreSQL database, authentication, CRUD operations, and row-level data security.

## 🚀 Features

- Perform basic arithmetic operations

- Persist calculations in PostgreSQL

- Create, read, update, and delete calculations

- Retrieve individual calculations by ID

- Retrieve calculation history

- Multi-user authentication

- Session-based user identification

- User-specific calculation history

- Row-level security to prevent users from accessing other users' data

- REST API between the React frontend and Node.js backend

- TypeScript across the application

## 🏗️ Architecture

```text
┌──────────────────────┐
│      React UI        │
│   TypeScript + CSS   │
└──────────┬───────────┘
           │
           │ HTTP / REST API
           ▼
┌──────────────────────┐
│     Node.js Server   │
│      TypeScript      │
│                      │
│  • Authentication    │
│  • Sessions          │
│  • CRUD Operations   │
│  • Request Handling  │
└──────────┬───────────┘
           │
           │ SQL
           ▼
┌──────────────────────┐
│      PostgreSQL      │
│                      │
│  • Users             │
│  • Calculations      │
│  • Relationships     │
│  • Row-Level Security│
└──────────────────────┘
```

## 🛠️ Tech Stack

### Frontend

- React

- TypeScript

- CSS

- Vite

### Backend

- Node.js

- TypeScript

- HTTP REST API

### Database

- PostgreSQL

- SQL

- Row-Level Security (RLS)

### Development

- Git

- GitHub

- Environment variables

## 📁 Project Structure

```text
calculator/
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── ...
│   └── ...
│
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── server.ts
│   │   └── ...
│   └── ...
│
├── .gitignore
├── package.json
└── README.md
```

> The exact structure may differ depending on the current project layout.

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install dependencies

Install the dependencies for the frontend and backend.

```bash
npm install
```

If the frontend and backend have separate `package.json` files:

```bash
cd client
npm install

cd ../server
npm install
```

### 3. Configure environment variables

Create a `.env` file for the backend.

Example:

```env
DATABASE_URL=your_postgresql_connection_string
PORT=3000
```

Do **not** commit your `.env` file.

### 4. Set up PostgreSQL

Create the database and required tables.

The database stores users and their calculations, with calculations associated with the user who created them.

A simplified representation is:

```text
users
 ├── id
 ├── ...
 │
 └──────< calculations
             ├── id
             ├── expression
             ├── result
             └── user_id
```

### 5. Start the backend

```bash
npm run dev
```

### 6. Start the frontend

```bash
npm run dev
```

Open the local development URL provided by Vite.

## 🔌 API

The backend exposes REST endpoints for interacting with calculations.

### Create a calculation

```http
POST /api/calculations
```

Creates and persists a new calculation for the authenticated user.

### Get calculation history

```http
GET /api/calculations
```

Returns calculations belonging to the authenticated user.

### Get a calculation

```http
GET /api/calculations/:id
```

Returns a specific calculation.

### Update a calculation

```http
PUT /api/calculations/:id
```

Updates an existing calculation.

### Delete a calculation

```http
DELETE /api/calculations/:id
```

Deletes a calculation.

Authentication and row-level security ensure that users can only interact with calculations they are authorized to access.

## 🔐 Security

A major goal of this project was understanding how authorization works in a real application.

The application separates:

**Authentication**

> Who is the user?

from:

**Authorization**

> Is this user allowed to access this resource?

Each calculation is associated with a user.

```text
User A
 ├── Calculation 1
 ├── Calculation 2
 └── Calculation 3

User B
 ├── Calculation 4
 └── Calculation 5
```

User A should never be able to retrieve, modify, or delete User B's calculations.

Row-Level Security is used at the database layer as an additional protection mechanism so that authorization is not dependent solely on application-level checks.

## 🧠 What I Learned

This project was built incrementally to understand how the pieces of a full-stack application communicate.

### HTTP

- HTTP request/response cycle

- HTTP methods

- Request bodies

- Headers

- Status codes

- REST API design

### Backend

- Node.js HTTP server

- Routing

- Request parsing

- API design

- CRUD operations

- Authentication

- Sessions

### Frontend

- React components

- State management

- `useState`

- `useEffect`

- API requests

- Connecting a frontend to a backend

### TypeScript

- Interfaces

- Union types

- Type annotations

- Typed application logic

### PostgreSQL

- Relational databases

- Tables and relationships

- SQL queries

- Foreign keys

- CRUD operations

- Connecting Node.js to PostgreSQL

### Security

- Authentication vs authorization

- Session management

- User-owned resources

- Row-Level Security

- Defense in depth

## 🗺️ Future Improvements

Potential improvements include:

- Password hashing and stronger authentication flows

- Better session management

- Input validation

- Centralized error handling

- API middleware

- Rate limiting

- More advanced calculator operations

- Pagination for calculation history

- Search and filtering

- Automated tests

- API documentation

- Dockerization

- Production deployment

- CI/CD

- Improved frontend UI/UX

## 🎯 Project Goal

The primary goal of this project was not simply to build a calculator.

It was to understand how a real application works from end to end:

```text
User
 ↓
React
 ↓
HTTP Request
 ↓
Node.js API
 ↓
Authentication / Authorization
 ↓
PostgreSQL
 ↓
Row-Level Security
 ↓
Response
 ↓
React UI
```

Starting from a basic calculator, the project was progressively expanded into a multi-user application to gain practical experience with full-stack development and backend security.

## 📌 Status

**In active development.**

The core calculator, persistence, REST API, CRUD functionality, authentication/session architecture, and database-level user isolation are being developed incrementally.

## 👨‍💻 Author

Built from scratch as a learning project focused on understanding full-stack web development, backend architecture, databases, and application security.