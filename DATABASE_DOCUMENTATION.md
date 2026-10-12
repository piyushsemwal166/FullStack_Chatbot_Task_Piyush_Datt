# DroneTV Database Documentation

The backend uses MongoDB with Mongoose. MongoDB Atlas or a local MongoDB server can be used.

## Connection

Create `backend/.env` from `backend/.env.example` and set:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
```

Start the backend:

```powershell
cd backend
npm run dev
```

The server connects to MongoDB during startup. Check the API with:

```text
GET http://localhost:5000/api/health
```

## Collections

### `admins`

Stores administrator accounts.

| Field | Description |
|---|---|
| `name` | Admin display name |
| `email` | Unique, lowercase email |
| `passwordHash` | bcrypt-hashed password |
| `role` | `admin` |
| `createdAt`, `updatedAt` | Automatic timestamps |

Seed or update the admin account from environment variables:

```powershell
cd backend
npm run seed:admin
```

### `enquiries`

Stores enquiries submitted from the contact form or chatbot.

| Field | Allowed values / rules |
|---|---|
| `name` | Required, 2–100 characters |
| `email` | Required email address |
| `phone` | Required, international format supported |
| `userType` | `Student`, `Customer`, `Other` |
| `serviceOrCourse` | Required, maximum 150 characters |
| `message` | Required, maximum 5,000 characters |
| `status` | `New`, `Contacted`, `In Progress`, `Closed` |
| `source` | `Chatbot`, `Contact Form` |
| `createdAt`, `updatedAt` | Automatic timestamps |

Indexes support email lookup, status/user-type filters, and text search across name, email, and phone.

### `chatconversations`

Stores anonymous chatbot sessions.

| Field | Description |
|---|---|
| `conversationId` | Unique browser conversation identifier |
| `messages` | User and assistant messages |
| `messages.role` | `user` or `assistant` |
| `messages.content` | Message text, maximum 2,000 characters |
| `messages.createdAt` | Message timestamp |
| `createdAt`, `updatedAt` | Conversation timestamps |

## MongoDB Atlas setup

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Add your development IP address under **Network Access**.
4. Copy the connection string.
5. Put it in `backend/.env` as `MONGODB_URI`.
6. Run the backend and verify `/api/health`.

Never commit `backend/.env` or expose MongoDB credentials in GitHub.
