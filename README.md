# Backend Authentication Service

A production-ready Node.js backend using Express, TypeScript, PostgreSQL, Prisma, JWT, Bcrypt, and node-cron.

## Features

- Signup and login with JWT authentication
- Password hashing with Bcrypt
- Cron job activating inactive users after 15 minutes
- Centralized error handling and validation
- Clean MVC + service architecture
- Prisma ORM with PostgreSQL
- Jest + Supertest integration tests

## Getting Started

1. Copy `.env.example` to `.env`
2. Update `DATABASE_URL` and `JWT_SECRET`
3. Configure SMTP settings for email notifications:
   - `SMTP_HOST`: Your SMTP server (e.g., smtp.gmail.com)
   - `SMTP_PORT`: SMTP port (587 for TLS)
   - `SMTP_USER`: Your email address
   - `SMTP_PASS`: Your email password or app password
4. Install dependencies:
   ```bash
   npm install
   ```
5. Generate Prisma client and migrate database:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
   If the `User` table is missing, ensure your `.env` has a valid `DATABASE_URL` and rerun the migration.
6. Run development server:
   ```bash
   npm run dev
   ```
7. Run tests:
   ```bash
   npm test
   ```

## API Endpoints

### Signup
POST `/api/auth/signup`

Body:
```json
{
  "fullname": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password@123",
  "confirmPassword": "Password@123",
  "gender": "female",
  "mobile": "1234567890"
}
```

### Login
POST `/api/auth/login`

Body:
```json
{
  "email": "jane@example.com",
  "password": "Password@123"
}
```

### Health check
GET `/api/health`

Response indicates whether the database connection is healthy.

### Fetch users
GET `/api/users`

Query parameters:
- `q`: Search query (searches fullname, email, mobile)
- `status`: Filter by status (active/inactive)
- `gender`: Filter by gender
- `sortBy`: Sort field (id, fullname, email, gender, mobile, status, createdAt)
- `sortOrder`: Sort order (asc/desc, default: asc)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Example: `GET /api/users?q=john&status=active&sortBy=createdAt&sortOrder=desc&page=1&limit=5`

Response:
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 100,
      "totalPages": 20
    }
  }
}
```

## Response Format

Success:
```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

Error:
```json
{
  "success": false,
  "message": "",
  "errors": []
}
```

## Cron Job

The cron job runs every minute and updates user status to `active` when a user has been inactive for at least 15 minutes.
