# Internship Assignment - Backend + Frontend Guide

This project has:

- **Backend**: Node.js + Express + MongoDB API
- **Frontend**: Simple raw HTML/CSS/JS page to test the backend APIs

This guide explains setup and usage in simple steps.

---

## 1) Project Structure

- `backend/` -> API server code
- `frontend/` -> simple UI (`index.html`, `styles.css`, `main.js`)

---

## 2) Backend Setup

### Requirements

- Node.js (v18 or newer recommended)
- npm
- MongoDB (local or cloud) but here i use cloud 

### Install backend dependencies

```bash
cd backend
npm install
```

### Environment variables

Create a `.env` file inside `backend/`.

Example values:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string 
JWT_SECRET_KEY=your_secret_key
```

> Use the same variable names expected by your backend code.

### Run backend

```bash
npm start
```

If everything is correct, backend should run on:

- `http://localhost:3000`

Health check:

- `GET /api/health`

---

## 3) Frontend Setup

The frontend is plain HTML/CSS/JS, no build step needed.

### Option A (recommended): run with a local static server

From project root:

```bash
python3 -m http.server 4173 --directory frontend
```

Then open:

- `http://localhost:4173`

### Option B: open file directly

You can open `frontend/index.html` directly in browser, but a local server is better.

---

## 4) How to Use the Frontend

1. Start backend first.
2. Start frontend server.
3. Open frontend page.
4. In **API Base URL**, keep `http://localhost:3000` (or change if your backend runs elsewhere).
5. Use sections in this order (recommended):
   - Register user -> Login user
   - Register admin -> Login admin
   - Create book with user token
   - Read/update/delete books
   - Admin reports

The **Response** box at the bottom shows API status and response JSON.

---

## 5) API Endpoints Summary

Base URL example: `http://localhost:3000`

## Health

- `GET /api/health`

## User Auth (`/api/auth`)

- `POST /api/auth/register`
  - Body: `fullName`, `email`, `password`, `gender`, `address`
- `POST /api/auth/login`
  - Body: `email`, `password`
  - Returns `accessToken`, sets refresh token cookie
- `POST /api/auth/change-password`
  - Protected (Bearer token)
  - Body: `oldPassword`, `newPassword`
- `POST /api/auth/refresh`
  - Uses refresh token cookie
  - Returns new access token
- `POST /api/auth/logout`
  - Uses refresh token cookie

## Admin Auth (`/api/admin`)

- `POST /api/admin/register`
  - Body: `email`, `password`
- `POST /api/admin/login`
  - Body: `email`, `password`
  - Returns `accessToken`, sets cookie
- `POST /api/admin/change-password`
  - Protected (Bearer token)
  - Body: `oldPassword`, `newPassword`
- `POST /api/admin/refresh`
  - Uses cookie
- `POST /api/admin/logout`
  - Uses cookie

## Admin Reports

- `GET /api/admin/authors`
  - Protected (admin token)
- `GET /api/admin/author-books/:id`
  - Protected (admin token)

## Books (`/api/books`)

- `POST /api/books/add`
  - Protected (user token)
  - Body: `title`, `description`, `price`, optional `publishedDate`
- `GET /api/books`
- `GET /api/books/:code`
- `PUT /api/books/:code`
  - Protected (owner/admin based on middleware)
  - Body: `price`
- `DELETE /api/books/:code`
  - Protected (owner/admin based on middleware)

---

## 6) Token/Cookie Notes (Important)

- Some endpoints need **Bearer token** in `Authorization` header.
- Some endpoints use **cookies** (refresh/logout routes).
- Frontend already sends requests with credentials enabled.
- Keep backend CORS/cookie settings correct when frontend and backend are on different origins.

---

## 7) Common Troubleshooting

### Backend not starting

- Check `.env` values
- Check MongoDB connection string
- Run `npm install` again in `backend/`

### Frontend loads but APIs fail

- Verify backend is running
- Verify API Base URL in frontend
- Check browser console/network tab
- Check backend terminal logs

### Unauthorized errors (401/403)

- Login again to refresh tokens
- Ensure token is copied correctly in token fields
- For admin endpoints, use admin token

---

## 8) Quick Start (copy-paste)

Terminal 1:

```bash
cd backend
npm install
npm start
```

Terminal 2 (from project root):

```bash
python3 -m http.server 4173 --directory frontend
```

Browser:

- Open `http://localhost:4173`
- Test all endpoints from the UI
