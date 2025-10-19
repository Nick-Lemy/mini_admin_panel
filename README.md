# Mini Admin Panel

A full-stack user management application with Protocol Buffers (Protobuf) serialization and cryptographic signature verification.

## Features

### 1. User Management (CRUD)

- Create, Read, Update, and Delete users
- User fields: `id`, `email`, `role` (admin/user), `status` (active/inactive), `createdAt`
- Data persisted in SQLite database using Sequelize ORM

### 2. User Graph

- Display chart of users created per day over the last 7 days
- _(To be implemented)_

### 3. Protocol Buffers (Protobuf)

- **Backend**: Defined `.proto` schema for User model
- **Backend Endpoint**: `/api/v1/users/export` returns all users serialized in protobuf format
- **Frontend**: Fetches protobuf data, deserializes it, and displays users in a table

### 4. Cryptographic Security

- **SHA-384 Hashing**: User emails are hashed using SHA-384 algorithm
- **Digital Signatures**: Each email hash is digitally signed using RSA-2048 keypair
- **Signature Verification**: Frontend verifies signatures before displaying users
- **Public Key Endpoint**: `/api/v1/users/public-key` exposes the public key for verification

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite with Sequelize ORM
- **Protobuf**: protobufjs
- **Crypto**: Node.js built-in crypto module (RSA-2048)

### Frontend

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Protobuf**: protobufjs
- **Crypto**: Web Crypto API

## Setup & Run Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory (in a new terminal):

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. (Optional) Configure environment variables:

The frontend includes a `.env.local` file with the API URL. If you need to change it:

```bash
# .env.local already contains:
NEXT_PUBLIC_API_URL=http://localhost:3043
```

See `frontend/ENV_CONFIG.md` for more details.

4. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### User CRUD Operations

- `GET /api/v1/users` - Get all users (with optional filters: role, status)
- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users/:id` - Get a specific user by ID
- `PUT /api/v1/users/:id` - Update a user
- `DELETE /api/v1/users/:id` - Delete a user

### Protobuf & Crypto

- `GET /api/v1/users/export` - Export all users in protobuf format
- `GET /api/v1/users/public-key` - Get RSA public key for signature verification

## How It Works

### Cryptographic Workflow

1. **User Creation**:

   - Backend receives user data via POST request
   - Email is hashed using SHA-384 algorithm
   - Hash is digitally signed using private RSA key
   - User is stored with email, hash, and signature

2. **Protobuf Export**:

   - Backend serializes all users using Protocol Buffers
   - Returns binary protobuf data via `/users/export` endpoint

3. **Frontend Verification**:
   - Fetches protobuf data from backend
   - Deserializes protobuf into user objects
   - Fetches public key from backend
   - Verifies each user's signature
   - Only displays users with valid signatures

### Key Features

- **RSA Keypair Generation**: Automatically generates RSA-2048 keypair on first run
- **Persistent Keys**: Keys are stored in `/backend/keys/` directory
- **SHA-384 Hashing**: Cryptographically secure hash function
- **Digital Signatures**: RSA signature ensures data integrity and authenticity

## Project Structure

```
mini_admin_panel/
├── backend/
│   ├── src/
│   │   ├── app.ts                      # Express app entry point
│   │   ├── configs/
│   │   │   ├── constants.ts
│   │   │   └── db.ts                   # Database configuration
│   │   ├── features/
│   │   │   └── user/
│   │   │       ├── user.controller.ts  # User controllers
│   │   │       ├── user.dto.ts         # Data transfer objects
│   │   │       ├── user.model.ts       # Sequelize model
│   │   │       └── user.route.ts       # API routes
│   │   ├── services/
│   │   │   ├── crypto.service.ts       # Crypto operations
│   │   │   └── protobuf.service.ts     # Protobuf serialization
│   │   └── protos/
│   │       └── user.proto              # Protobuf schema
│   ├── keys/                           # RSA keypair storage
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                # Main page component
│   │   │   └── layout.tsx
│   │   ├── services/
│   │   │   ├── crypto.service.ts       # Signature verification
│   │   │   └── protobuf.service.ts     # Protobuf deserialization
│   │   └── protos/
│   │       └── user.proto              # Protobuf schema (copy)
│   ├── public/
│   │   └── protos/
│   │       └── user.proto              # Public protobuf schema
│   └── package.json
│
└── README.md
```

## Notes & Assumptions

1. **Database**: Using SQLite for simplicity. In production, consider PostgreSQL or MySQL.

2. **RSA Keys**: Keys are auto-generated on first run and stored in `/backend/keys/`. For production, use a secure key management service.

3. **Signature Algorithm**: Using RSA-2048 with SHA-256 for signing. The email itself is hashed with SHA-384 as per requirements.

4. **CORS**: Enabled for local development. Configure appropriately for production.

5. **Protobuf Schema**: Kept in sync between backend and frontend. Changes to schema require updates in both locations.

6. **Signature Verification**: Currently using simplified verification in the frontend. For production, consider server-side verification or more robust Web Crypto API implementation.

7. **Environment Variables**: Backend port defaults to 3000. Can be configured via environment variables.

## Testing the Implementation

### Create a User

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "role": "user", "status": "active"}'
```

### Get Users (JSON)

```bash
curl http://localhost:3000/api/v1/users
```

### Get Users (Protobuf)

```bash
curl http://localhost:3000/api/v1/users/export --output users.pb
```

### Get Public Key

```bash
curl http://localhost:3000/api/v1/users/public-key
```

## Future Enhancements

- [ ] Implement user graph showing users created per day
- [ ] Add user authentication and authorization
- [ ] Implement proper error handling and validation
- [ ] Add unit and integration tests
- [ ] Deploy to production environment
- [ ] Add Docker support for easier deployment

## License

MIT
