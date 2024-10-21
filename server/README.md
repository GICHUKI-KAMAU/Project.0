# Task Management App (Backend)

This is the **backend** of the Task Management Application built with **Node.js**, **Express**, **TypeScript**, and **Xata** as the database. The backend provides a RESTful API that enables user authentication, team/project/task management, and commenting. Authentication is handled with both **JWT tokens** and **session-based authentication** using cookies.

# Table of Contents

1. [Overview](#overview)
2. [Technologies Used](#technologies-used)
3. [Authentication](#authentication)
   - [JWT Authentication](#jwt-authentication)
   - [Session-based Authentication (with Cookies)](#session-based-authentication-with-cookies)
4. [Middleware](#middleware)
5. [Endpoints](#endpoints)
   - [Authentication Endpoints](#authentication-endpoints)
   - [Team Management Endpoints](#team-management-endpoints)
   - [Project Management Endpoints](#project-management-endpoints)
   - [Task Management Endpoints](#task-management-endpoints)
   - [Comment Management Endpoints](#comment-management-endpoints)
6. [Setup Instructions](#setup-instructions)
   - [Prerequisites](#prerequisites)
   - [Install Dependencies](#install-dependencies)
   - [Run Development Server](#run-development-server)
7. [Testing](#testing)
8. [Example Usage](#Example-Usage)

---

## Technologies Used

- **Backend**: Node.js, Express, TypeScript
- **Database**: Xata (a serverless database solution)
- **Authentication**: JWT (JSON Web Tokens), Cookies, Express-session
- **Utilities**: bcrypt for password hashing, cookie-parser for managing cookies, dotenv for environment variables, jsonwebtoken for token management
- **Testing**: Jest, Supertest

---

## Project Features

- **User Authentication**: Users can sign up, log in, and log out with JWT and session-based authentication.
- **Team and Project Management**: Users can create teams, assign team members, and manage projects.
- **Task Management**: Users can create tasks, assign them to team members, set due dates, update task status, and track progress.
- **Role-Based Access Control (RBAC)**: The system supports two roles: `admin` and `regular user`. Admins have special privileges.
- **Comment System**: Tasks have comments for discussions and collaboration.

---

## Database Schema

- **Users**: Stores user information such as username, email, hashed password, and role.
- **Teams**: A team can have multiple users, and users can belong to multiple teams.
- **Projects**: Each project belongs to a specific team.
- **Tasks**: Tasks are assigned to users within a project and have attributes like description, due date, status, and assignee.
- **Comments**: Users can comment on tasks for collaboration.

### Relationships:

- **Users ↔ Teams**: Many-to-many
- **Teams ↔ Projects**: One-to-many
- **Projects ↔ Tasks**: One-to-many
- **Tasks ↔ Comments**: One-to-many

---

## Project Structure

```bash
.
├── src
│   ├── controllers
│   │   ├── AuthController.ts        # Handles user authentication logic
│   │   ├── TeamController.ts        # Handles team-related operations
│   │   ├── ProjectController.ts     # Handles project-related operations
│   │   ├── TaskController.ts        # Handles task-related operations
│   │   └── CommentController.ts     # Manages comments on tasks
│   ├── middlewares
│   │   ├── authMiddleware.ts        # JWT & session-based authentication middleware
│   ├── routes
│   │   ├── authRoutes.ts            # Routes for authentication (signup, login, logout)
│   │   ├── teamRoutes.ts            # Routes for team management
│   │   ├── projectRoutes.ts         # Routes for project management
│   │   ├── taskRoutes.ts            # Routes for task management
│   │   └── commentRoutes.ts         # Routes for task comments
│   ├── utils
│   │   ├── bcryptUtils.ts           # Utilities for password hashing and comparison
│   │   ├── jwtUtils.ts              # Utilities for JWT creation and verification
│   ├── app.ts                       # Main Express app setup
│   ├── server.ts                    # Entry point to start the server
│   ├── xata.ts                      # Xata client setup
│   └── types
│       └── index.ts                 # TypeScript types and interfaces for models (User, Task, etc.)
├── tests                            # Contains all test files for API endpoints
│   ├── auth.test.ts
│   ├── task.test.ts
│   └── ...
└── package.json

```

## Authentication

### JWT Authentication

JWT is used for stateless authentication. When a user logs in, a JWT token is generated, which contains the user’s `id` and `role`. The token is then passed in the Authorization header with each request to authenticate users and grant access to protected routes.

- **Token Generation**: A JWT token is generated during login, containing the user’s `id` and `role`.
- **Token Verification**: On each request, the token is validated and decoded to retrieve user information.
- **Role-based Access**: The user's role is checked (admin or user), and permissions are enforced based on this.

### Session-based Authentication (with Cookies)

The backend also supports session-based authentication using cookies. When a user logs in, a session cookie (`token`) is set in the response, and subsequent requests use this session cookie for authentication.

- **Session Cookie**: The session cookie is HTTP-only and is stored on the client side.
- **Logout**: The session cookie is cleared when the user logs out.

---
## Endpoints

### Authentication Endpoints

- `POST /api/auth/signup`: Registers a new user.
- `POST /api/auth/login`: Logs in an existing user and sets a session cookie.
- `POST /api/auth/logout`: Logs out the user and clears the session cookie.
- `GET /api/auth/users`: Gets all users (admin-only).
- `GET /api/auth/users/:id`: Gets a user by ID (protected route).

### Team Management Endpoints

- `POST /api/teams`: Creates a new team (requires authentication).
- `GET /api/teams`: Retrieves all teams (requires authentication).
- `GET /api/teams/:id`: Retrieves a team by ID (requires authentication).
- `PUT /api/teams/:id`: Updates a team by ID (requires authentication).
- `DELETE /api/teams/:id`: Deletes a team by ID (requires authentication).

### Project Management Endpoints

- `POST /api/projects`: Creates a new project within a team (requires authentication).
- `GET /api/projects`: Retrieves all projects (requires authentication).
- `GET /api/projects/:id`: Retrieves a project by ID (requires authentication).
- `PUT /api/projects/:id`: Updates a project by ID (requires authentication).
- `DELETE /api/projects/:id`: Deletes a project by ID (requires authentication).

### Task Management Endpoints

- `POST /api/tasks`: Creates a new task within a project (requires authentication).
- `GET /api/tasks`: Retrieves all tasks (requires authentication).
- `GET /api/tasks/:id`: Retrieves a task by ID (requires authentication).
- `PUT /api/tasks/:id`: Updates a task’s details (description, status, assigned user, etc.) (requires authentication).
- `DELETE /api/tasks/:id`: Deletes a task by ID (requires authentication).

### Comment Management Endpoints

- `POST /api/comments`: Adds a comment to a task.
- `GET /api/comments/task/:name`: Retrieves all comments for a task by task name.

---

## Setup Instructions

### Prerequisites

1. Install **Node.js**.
2. Have a **Xata account** and a configured database.
3. Ensure you have a `.env` file containing the following environment variables:
   - `JWT_SECRET`: Secret key for JWT signing and verification.
   - `XATA_API_KEY`: Your Xata API key.
   - `XATA_DB_URL`: Xata database URL.

---

## Install Dependencies

```bash
pnpm install
```

## Run Development Server

```bash
pnpm run dev
```
---

### Example Usage

Below are the screenshots for each route, demonstrating the requests and responses.

#### Authentication Endpoints
- **Signup Endpoint**: ![Signup Screenshot](path/to/screenshot_signup.png)
- **Login Endpoint**: ![Login Screenshot](path/to/screenshot_login.png)
- **Logout Endpoint**: ![Logout Screenshot](path/to/screenshot_logout.png)
- **Get Users Endpoint**: ![Get Users Screenshot](path/to/screenshot_get_users.png)
- **Get User by ID Endpoint**: ![Get User by ID Screenshot](path/to/screenshot_get_user_by_id.png)

#### Team Management Endpoints
- **Create Team Endpoint**: ![Create Team Screenshot](path/to/screenshot_create_team.png)
- **Get Teams Endpoint**: ![Get Teams Screenshot](path/to/screenshot_get_teams.png)
- **Get Team by ID Endpoint**: ![Get Team by ID Screenshot](path/to/screenshot_get_team_by_id.png)
- **Update Team Endpoint**: ![Update Team Screenshot](path/to/screenshot_update_team.png)
- **Delete Team Endpoint**: ![Delete Team Screenshot](path/to/screenshot_delete_team.png)

#### Project Management Endpoints
- **Create Project Endpoint**: ![Create Project Screenshot](path/to/screenshot_create_project.png)
- **Get Projects Endpoint**: ![Get Projects Screenshot](path/to/screenshot_get_projects.png)
- **Get Project by ID Endpoint**: ![Get Project by ID Screenshot](path/to/screenshot_get_project_by_id.png)
- **Update Project Endpoint**: ![Update Project Screenshot](path/to/screenshot_update_project.png)
- **Delete Project Endpoint**: ![Delete Project Screenshot](path/to/screenshot_delete_project.png)

#### Task Management Endpoints
- **Create Task Endpoint**: ![Create Task Screenshot](path/to/screenshot_create_task.png)
- **Get Tasks Endpoint**: ![Get Tasks Screenshot](path/to/screenshot_get_tasks.png)
- **Get Task by ID Endpoint**: ![Get Task by ID Screenshot](path/to/screenshot_get_task_by_id.png)
- **Update Task Endpoint**: ![Update Task Screenshot](path/to/screenshot_update_task.png)
- **Delete Task Endpoint**: ![Delete Task Screenshot](path/to/screenshot_delete_task.png)

#### Comment Management Endpoints
- **Add Comment Endpoint**: ![Add Comment Screenshot](path/to/screenshot_add_comment.png)
- **Get Comments by Task Name Endpoint**: ![Get Comments by Task Name Screenshot](path/to/screenshot_get_comments_by_task_name.png)

