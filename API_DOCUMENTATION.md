# DroneTV API Documentation

Base URL:

```text
http://localhost:5000/api
```

Protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

## Endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | No | API health check |
| POST | `/auth/login` | No | Admin login |
| POST | `/enquiries` | No | Submit enquiry |
| GET | `/enquiries` | Admin | List/search/filter enquiries |
| GET | `/enquiries/:id` | Admin | View enquiry |
| PATCH | `/enquiries/:id` | Admin | Update enquiry |
| DELETE | `/enquiries/:id` | Admin | Delete enquiry |
| GET | `/stats` | Admin | Dashboard statistics |
| POST | `/chat` | No | Chatbot response |

## Admin login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

Returns a JWT token:

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

## Create enquiry

```http
POST /api/enquiries
Content-Type: application/json
```

```json
{
  "name": "Demo User",
  "email": "demo@gmail.com",
  "phone": "+91 90000 00000",
  "userType": "Student",
  "serviceOrCourse": "Drone Pilot Training",
  "message": "I am interested in the next batch.",
  "source": "Contact Form"
}
```

Allowed values:

- `userType`: `Student`, `Customer`, `Other`
- `status`: `New`, `Contacted`, `In Progress`, `Closed`
- `source`: `Chatbot`, `Contact Form`

## Enquiry management

List enquiries:

```http
GET /api/enquiries?search=demo&status=New&page=1&limit=20
Authorization: Bearer <JWT_TOKEN>
```

Update status:

```http
PATCH /api/enquiries/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

```json
{
  "status": "Contacted"
}
```

Delete:

```http
DELETE /api/enquiries/:id
Authorization: Bearer <JWT_TOKEN>
```

Successful deletion returns `204 No Content`.

## Dashboard statistics

```http
GET /api/stats
Authorization: Bearer <JWT_TOKEN>
```

Returns total enquiries, status counts, source counts, and seven-day activity.

## Chatbot

```http
POST /api/chat
Content-Type: application/json
```

```json
{
  "message": "What courses are available?",
  "conversationId": "visitor-session-123456"
}
```

The response includes:

```json
{
  "data": {
    "reply": "DroneTV offers drone training courses...",
    "provider": "gemini",
    "retryable": false,
    "conversationId": "visitor-session-123456"
  }
}
```

`provider` can be `gemini` or `fallback`. The fallback is used when Gemini is unavailable.

## Common responses

```json
{ "error": "Validation failed", "details": [] }
```

| Status | Meaning |
|---:|---|
| `200` | Success |
| `201` | Enquiry created |
| `204` | Enquiry deleted |
| `400` | Invalid input |
| `401` | Missing or invalid login |
| `403` | Admin access required |
| `404` | Resource not found |
| `429` | Too many requests |
| `500` | Safe server error |

Run the backend:

```powershell
cd backend
npm run dev
```
