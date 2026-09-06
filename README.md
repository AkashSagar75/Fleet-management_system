# Fleet Management System

A fleet management application with a React/Vite frontend and an Express/MySQL backend.

## Project Structure

```text
Fleet-management_system/
|-- backedn/    # Express API server
|-- myapp/      # React + Vite client
|-- README.md
```

## Requirements

- Node.js 18 or newer
- npm
- MySQL
- Redis (required for queue features)
- Razorpay account (required for payment features)

## Backend Setup

Open a terminal in the backend folder:

```bash
cd backedn
npm install
npm run dev
```

The backend uses `SERVER_PORT` from the environment. The frontend defaults to:

```text
http://localhost:8087
```

Create `backedn/.env` with the values required by your local setup:

```env
SERVER_PORT=8087
JWT_ACCESS_SECRET=replace-with-a-long-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-refresh-secret
REDIS_HOST=localhost
REDIS_PORT=6379
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
EMAIL_USER=your-email-address
EMAIL_PASS=your-email-password-or-app-password
```

Make sure MySQL is running and the `fleet_managess` database exists before starting the server.

Available backend commands:

```bash
npm start       # Start the server with Node
npm run dev     # Start the server with Nodemon
```

## Frontend Setup

Open another terminal in the frontend folder:

```bash
cd myapp
npm install
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

To use a different backend URL, create `myapp/.env`:

```env
VITE_API_URL=http://localhost:8087
```

Available frontend commands:

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

## Running Locally

1. Start MySQL and Redis.
2. Start the backend with `npm run dev` inside `backedn`.
3. Start the frontend with `npm run dev` inside `myapp`.
4. Open the URL printed by Vite in your browser.

## Main Backend Routes

- `/auth` - Authentication and token operations
- `/menu` - Menu and permission data
- `/company` - Company operations
- `/common` - Shared data operations
- `/payment` - Razorpay payment operations
- `/transport` - Transport and vehicle operations

## Authentication Storage

The frontend stores the access token in `sessionStorage` and the refresh token in `localStorage`. Axios automatically sends the access token with API requests and handles expired access tokens through the refresh-token endpoint.

## Common Troubleshooting

### API connection error

Check that the backend is running and that `VITE_API_URL` points to the correct API address. Restart Vite after changing a `.env` file.

### Database connection error

Check that MySQL is running and that the configured database exists. Confirm the database user has access to the fleet database.

### Redis or queue error

Start Redis locally and verify `REDIS_HOST` and `REDIS_PORT` in the backend environment.

### CORS error

The backend currently allows the local frontend origin `http://localhost:5173`. Use that URL during local development or update the backend CORS configuration for another frontend origin.

## Security Notes

- Do not commit `.env` files or real credentials.
- Use strong, unique JWT secrets.
- Use an email app password instead of a personal email password when supported.
- Keep Razorpay keys and database credentials private.
