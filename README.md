# Finance Dashboard System

A full-stack finance dashboard system built with Next.js, Node.js, TypeScript, and PostgreSQL. This system allows different users to interact with financial records based on their role.

## Live Demo

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@finance.com | admin123 |
| Analyst | sahil@example.com | 1234 |
| Editor | rohit@example.com | 1234 |

> New registrations are always assigned the Viewer role by default. Only an Admin can upgrade roles.

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL (Neon cloud)
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- Next.js 16 with App Router
- TypeScript
- Recharts for data visualization
- Axios for API calls

## Features

### Authentication
- JWT based login and registration
- Passwords are hashed using bcryptjs
- Tokens expire after 7 days
- Protected routes with middleware

### Role Based Access Control
Four roles with different permissions:

| Feature | Viewer | Analyst | Editor | Admin |
|---------|--------|---------|--------|-------|
| View Dashboard Summary | ✅ | ✅ | ✅ | ✅ |
| View Charts and Analytics | ❌ | ✅ | ✅ | ✅ |
| View Records | ✅ | ✅ | ✅ | ✅ |
| Create Records | ❌ | ❌ | ✅ | ✅ |
| Update Records | ❌ | ❌ | ✅ | ✅ |
| Delete Records | ❌ | ❌ | ❌ | ✅ |
| View Users | ❌ | ✅ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |

### Financial Records
- Create, read, update, and delete financial records
- Filter by type, category, and date range
- Soft delete so data is never permanently lost
- Each record has amount, type, category, date, and notes

### Dashboard Analytics
- Total income, expenses, and net balance
- Monthly income vs expense trends
- Category wise breakdown
- Weekly trends for last 7 days
- Recent activity feed
- Role based chart visibility

### User Management (Admin only)
- View all users
- Change user roles
- Activate or deactivate users
- Delete users

## Project Structure
Finance_Dashboard_system/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── record.controller.ts
│   │   │   └── dashboard.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   └── role.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── record.routes.ts
│   │   │   └── dashboard.routes.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── record.service.ts
│   │   │   └── dashboard.service.ts
│   │   ├── utils/
│   │   │   ├── prisma.ts
│   │   │   └── jwt.utils.ts
│   │   ├── seed.ts
│   │   └── index.ts
│   ├── .env
│   ├── .env.example
│   └── package.json
└── frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── records/
│   │   │   ├── users/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── api.ts
│   │   └── auth.ts
│   └── types/
│       └── index.ts
├── .env.local
└── package.json

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login user |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/users | Admin, Analyst | Get all users |
| GET | /api/users/:id | Admin, Analyst | Get user by ID |
| PATCH | /api/users/:id/role | Admin | Update user role |
| PATCH | /api/users/:id/status | Admin | Toggle user status |
| DELETE | /api/users/:id | Admin | Delete user |

### Financial Records
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/records | Admin, Editor | Create record |
| GET | /api/records | All roles | Get all records |
| GET | /api/records/:id | All roles | Get record by ID |
| PUT | /api/records/:id | Admin, Editor | Update record |
| DELETE | /api/records/:id | Admin | Delete record |

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/dashboard/summary | All roles | Get summary totals |
| GET | /api/dashboard/categories | Analyst and above | Category wise totals |
| GET | /api/dashboard/monthly | Analyst and above | Monthly trends |
| GET | /api/dashboard/weekly | Analyst and above | Weekly trends |
| GET | /api/dashboard/recent | Analyst and above | Recent activity |

## Setup Instructions

### Prerequisites
- Node.js v18 or above
- PostgreSQL database (we used Neon cloud)
- Git

### Step 1 - Clone the repository
```bash
git clone https://github.com/SahilArate/Finance_Dashboard_system-
cd Finance_Dashboard_system-
```

### Step 2 - Setup Backend
```bash
cd backend
npm install
```

Copy the example env file and fill in your values:
```bash
cp .env.example .env
```

Run database migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

Seed the database with sample data:
```bash
npx ts-node src/seed.ts
```

Start the backend server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

### Step 3 - Setup Frontend
```bash
cd frontend
npm install
```

Copy the example env file:
```bash
cp .env.example .env.local
```

Start the frontend:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Database Schema

### User
- id, name, email, password, role, isActive, createdAt, updatedAt

### FinancialRecord
- id, amount, type, category, date, notes, isDeleted, createdAt, updatedAt, userId

## Design Decisions and Assumptions

1. **Role Assignment** - New users always register as Viewer. Only Admin can upgrade roles. This prevents unauthorized access.

2. **Soft Delete** - Financial records are never permanently deleted. The isDeleted flag is set to true. This preserves data integrity and audit trails.

3. **JWT Auth** - Tokens are stored in localStorage and sent as Bearer tokens. Tokens expire after 7 days.

4. **Role Based UI** - The frontend hides buttons and charts based on user role. The backend also enforces the same rules so even direct API calls are blocked.

5. **Neon PostgreSQL** - We used Neon for cloud hosted PostgreSQL which allows the database to be accessible from anywhere without local setup.

6. **Prisma ORM** - Used Prisma for type safe database queries and easy migrations.

## Postman Collection

Import the following requests in Postman:

### Register
- POST http://localhost:5000/api/auth/register
- Body: { "name": "Test User", "email": "test@example.com", "password": "test123" }

### Login
- POST http://localhost:5000/api/auth/login
- Body: { "email": "admin@finance.com", "password": "admin123" }
- Copy the token from response

### Use Token
- For all protected routes add Header:
- Key: Authorization
- Value: Bearer your_token_here

### Create Record
- POST http://localhost:5000/api/records
- Body: { "amount": 5000, "type": "INCOME", "category": "Salary", "date": "2024-01-01", "notes": "Monthly salary" }

### Get Dashboard Summary
- GET http://localhost:5000/api/dashboard/summary

## Known Limitations

- No pagination implemented yet
- No file upload support
- Frontend is not deployed yet

## Author

Sahil Arate