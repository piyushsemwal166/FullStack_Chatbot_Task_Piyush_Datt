# DroneTV API Documentation

REST API reference for the DroneTV AI Support & Lead Assistant backend.

## Quick start

Start the backend from the project root:

```powershell
cd backend
npm install
npm run dev
```

The default API base URL is:

```text
http://localhost:5000/api
```

The port and frontend origin are configured through `backend/.env`.

## Authentication

Admin endpoints use a JWT returned by `POST /auth/login`.

Send the token in the `Authorization` header:

```http
Authorization: Bearer <JWT_TOKEN>
```

Public endpoints do not require authentication:

- `GET /health`
- `POST /auth/login`
- `POST /enquiries`
- `POST /chat`

Protected endpoints require an administrator token:

- `GET /enquiries`
- `GET /enquiries/:id`
- `PATCH /enquiries/:id`
- `DELETE /enquiries/:id`
- `GET /stats`

## Response conventions

Successful responses use a `data` property. Collection responses also include `meta`.

```json
{
  "data": {}
}
```

Validation errors use HTTP `400`:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

Other common errors:

```json
{ "error": "Authentication required" }
```

```json
{ "error": "Enquiry not found" }
```

The API accepts JSON request bodies up to 32 KB. Requests are protected by Helmet, restricted CORS, and a configurable global rate limit.

## Endpoint reference

| Method | Endpoint | Auth | Purpose |
|---|---|---:|---|
| GET | `/health` | No | Check that the API is running |
| POST | `/auth/login` | No | Authenticate an administrator |
| POST | `/enquiries` | No | Create a public enquiry |
| GET | `/enquiries` | Admin | List, search, filter, and paginate enquiries |
| GET | `/enquiries/:id` | Admin | Get one enquiry |
| PATCH | `/enquiries/:id` | Admin | Update an enquiry |
| DELETE | `/enquiries/:id` | Admin | Delete an enquiry |
| GET | `/stats` | Admin | Get dashboard statistics |
| POST | `/chat` | No | Get a chatbot response and optionally submit an enquiry |

## Health check

### `GET /api/health`

Response `200`:

```json
{
  "data": {
    "status": "ok"
  }
}
```

```bash
curl http://localhost:5000/api/health
```

## Authentication

### `POST /api/auth/login`

Request body:

```json
{
  "email": "admin@example.com",
  "password": "your-admin-password"
}
```

Response `200`:

```json
{
  "data": {
    "token": "<JWT_TOKEN>",
    "admin": {
      "id": "<ADMIN_ID>",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

Invalid credentials return `401`:

```json
{
  "error": "Invalid email or password"
}
```

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"your-admin-password\"}"
```

## Enquiries

### Enquiry fields

| Field | Required on create | Rules |
|---|---:|---|
| `name` | Yes | 2–100 characters |
| `email` | Yes | Common provider email such as Gmail, Outlook, Yahoo, iCloud, Proton, Zoho, AOL, Hotmail, Live, or MSN |
| `phone` | Yes | 7–30 characters; supports international formats |
| `userType` | Yes | `Student`, `Customer`, or `Other` |
| `serviceOrCourse` | Yes | 1–150 characters |
| `message` | Yes | 1–5,000 characters |
| `status` | No | `New`, `Contacted`, `In Progress`, or `Closed` |
| `source` | Yes | `Chatbot` or `Contact Form` |

### `POST /api/enquiries`

Public enquiry creation. New enquiries default to status `New` in the database.

Request:

```json
{
  "name": "Demo Student",
  "email": "demo@gmail.com",
  "phone": "+91 90000 00000",
  "userType": "Student",
  "serviceOrCourse": "Drone Pilot Training",
  "message": "I would like to know about the next training batch.",
  "source": "Contact Form"
}
```

Response `201`:

```json
{
  "data": {
    "_id": "<ENQUIRY_ID>",
    "name": "Demo Student",
    "email": "demo@gmail.com",
    "phone": "+91 90000 00000",
    "userType": "Student",
    "serviceOrCourse": "Drone Pilot Training",
    "message": "I would like to know about the next training batch.",
    "status": "New",
    "source": "Contact Form",
    "createdAt": "2026-10-12T10:00:00.000Z",
    "updatedAt": "2026-10-12T10:00:00.000Z"
  }
}
```

```bash
curl -X POST http://localhost:5000/api/enquiries \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Demo Student\",\"email\":\"demo@gmail.com\",\"phone\":\"+91 90000 00000\",\"userType\":\"Student\",\"serviceOrCourse\":\"Drone Pilot Training\",\"message\":\"I would like to know about the next training batch.\",\"source\":\"Contact Form\"}"
```

### `GET /api/enquiries`

Protected enquiry list endpoint.

Query parameters:

| Parameter | Description |
|---|---|
| `search` | Searches name, email, and phone |
| `userType` | `Student`, `Customer`, or `Other` |
| `status` | `New`, `Contacted`, `In Progress`, or `Closed` |
| `page` | Positive page number; defaults to `1` |
| `limit` | 1–100 records per page; defaults to `20` |

Example:

```bash
curl "http://localhost:5000/api/enquiries?search=demo&status=New&page=1&limit=20" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

Response `200`:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "pages": 0
  }
}
```

### `GET /api/enquiries/:id`

Returns one enquiry. Invalid IDs return `400`; a valid but unknown ID returns `404`.

```bash
curl http://localhost:5000/api/enquiries/<ENQUIRY_ID> \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### `PATCH /api/enquiries/:id`

Protected partial update. At least one field is required.

Request:

```json
{
  "status": "Contacted"
}
```

```bash
curl -X PATCH http://localhost:5000/api/enquiries/<ENQUIRY_ID> \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"Contacted\"}"
```

Response `200`:

```json
{
  "data": {
    "_id": "<ENQUIRY_ID>",
    "status": "Contacted"
  }
}
```

### `DELETE /api/enquiries/:id`

Protected deletion. A successful deletion returns `204 No Content`.

```bash
curl -X DELETE http://localhost:5000/api/enquiries/<ENQUIRY_ID> \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## Dashboard statistics

### `GET /api/stats`

Protected endpoint used by the admin overview.

Response `200`:

```json
{
  "data": {
    "total": 12,
    "statuses": {
      "new": 5,
      "contacted": 3,
      "inProgress": 2,
      "closed": 2
    },
    "bySource": [
      { "_id": "Contact Form", "count": 8 },
      { "_id": "Chatbot", "count": 4 }
    ],
    "activity": [
      { "_id": "2026-10-12", "count": 3 }
    ]
  }
}
```

```bash
curl http://localhost:5000/api/stats \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## Chatbot

### `POST /api/chat`

Public chatbot endpoint. The backend stores messages in MongoDB using a conversation ID. If no `conversationId` is supplied, the API generates one.

Request:

```json
{
  "message": "What courses are available?",
  "conversationId": "visitor-session-123456",
  "history": [
    {
      "role": "user",
      "text": "Hello"
    }
  ]
}
```

The `message` is required and limited to 2,000 characters. `history` accepts up to 20 messages. The optional `enquiry` object allows a chatbot user to submit an enquiry in the same request.

Example with an enquiry:

```json
{
  "message": "Please send my enquiry.",
  "conversationId": "visitor-session-123456",
  "enquiry": {
    "name": "Demo Customer",
    "email": "demo@outlook.com",
    "phone": "+1 555 000 0000",
    "userType": "Customer",
    "serviceOrCourse": "Aerial Photography",
    "message": "I am interested in the next available batch."
  }
}
```

Response `200`:

```json
{
  "data": {
    "reply": "DroneTV offers DGCA Drone Pilot, FPV Fundamentals, Aerial Cinematography, and Agriculture Drone Operations training. Tell me your goal and I can suggest a course.",
    "provider": "gemini",
    "retryable": false,
    "conversationId": "visitor-session-123456"
  }
}
```

`provider` is either `gemini` or `fallback`. The fallback is used when Gemini is not configured or unavailable. A successfully submitted embedded enquiry is returned in the `enquiry` property.

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"What courses are available?\",\"conversationId\":\"visitor-session-123456\"}"
```

## Error handling

| Status | Meaning |
|---:|---|
| `201` | Resource created |
| `200` | Request completed |
| `204` | Resource deleted |
| `400` | Invalid request body, query, or ID |
| `401` | Missing, invalid, or expired JWT; invalid login |
| `403` | Valid token without administrator access |
| `404` | Route or resource not found |
| `409` | Duplicate administrator email |
| `429` | Rate limit exceeded |
| `500` | Safe generic server error |

Internal stack traces, credentials, JWT secrets, database details, and provider errors are not returned to clients.

## Local testing workflow

1. Create `backend/.env` from `backend/.env.example`.
2. Start MongoDB Atlas access and run `npm run dev` in `backend`.
3. Verify `GET /api/health`.
4. Log in with the seeded administrator and copy the returned token.
5. Create a public enquiry with `POST /api/enquiries`.
6. List and filter enquiries with the bearer token.
7. Update its status and verify the result.
8. Test the chatbot with and without `GEMINI_API_KEY`.
9. Run backend tests:

```powershell
cd backend
npm test
npm run build
```

Never place real credentials, API keys, JWTs, or MongoDB connection strings in this documentation or in source control.
