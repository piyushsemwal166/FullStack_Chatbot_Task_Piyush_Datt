# DroneTV Support Backend

## Setup

1. Install MongoDB locally or create a MongoDB Atlas database.
2. Copy `.env.example` to `.env` and set a MongoDB URI, a random JWT secret of at least 32 characters, frontend origin, an admin name, and an admin password of at least 8 characters.
3. Run `pnpm install` (or `npm install`) in this directory.
4. Start development mode with `pnpm dev`; build and run production with `pnpm build && pnpm start`.

The chatbot uses the official `@google/genai` JavaScript SDK. Set `GEMINI_API_KEY` from Google AI Studio and set `GEMINI_MODEL` to a currently available text model for your account. The key is read only by the backend and is never sent to the browser. A 12-second provider timeout, request rate limit, bounded history, and safe fallback keep the endpoint responsive when Gemini is unavailable.

The first server start creates the administrator specified by `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD`. Existing administrators are not overwritten. To explicitly create or rotate the configured administrator, run `npm run seed:admin`; this reads credentials only from the backend `.env` file.

## API

`POST /api/auth/login` accepts `{ "email": "...", "password": "..." }` and returns `{ "data": { "token", "admin" } }`.

All enquiry reads, updates, and deletes require `Authorization: Bearer <admin-jwt>`. `POST /api/enquiries` is public so the contact form and chatbot can submit leads.

- `GET /api/enquiries?search=arjun&userType=Student&status=New&page=1&limit=20`
- `GET /api/enquiries/:id`
- `POST /api/enquiries`
- `PATCH /api/enquiries/:id`
- `DELETE /api/enquiries/:id`
- `POST /api/chat`
- `GET /api/stats` (administrator token required; returns live status, source, and seven-day activity aggregates)

Enquiries use `userType` values `Student`, `Customer`, `Other`; `status` values `New`, `Contacted`, `In Progress`, `Closed`; and `source` values `Chatbot`, `Contact Form`. Successful responses use a `data` property; lists also include pagination metadata. Validation errors return HTTP 400 with `error` and `details`. Missing, invalid, or expired credentials return 401/403 without exposing server internals.

Chat accepts `{ "message": "Which course is right for me?", "conversationId": "browser-session-id", "history": [{ "role": "user", "text": "Hello" }] }`. History is capped at 20 messages and each message is capped at 2,000 characters. The anonymous conversation ID is stored in the browser session and messages are persisted in MongoDB. To submit a lead in the same request, include an `enquiry` object with name, email, phone, userType, serviceOrCourse, and message. Responses include `provider` (`gemini` or `fallback`), `retryable`, and `conversationId`.

## Frontend

Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api` in the frontend environment. The frontend should log in once, retain the returned token in memory or secure storage, and send it for dashboard requests. Never commit `.env` files or real credentials.

The existing Next.js frontend exposes:

- `/` public landing page with floating Sky assistant
- `/courses` course catalogue
- `/contact` validated public enquiry form
- `/chat` full chatbot experience with history and suggested questions
- `/chatbot` standalone Sky chatbot with session history and embedded enquiry form
- `/admin/login` administrator login
- `/admin/overview` protected live statistics and seven-day activity chart
- `/admin/enquiries` protected search, filters, detail drawer, status changes, and delete confirmation

Start the backend before submitting forms or loading live dashboard data. If Gemini is not configured, chatbot requests remain functional through the built-in safe fallback.
