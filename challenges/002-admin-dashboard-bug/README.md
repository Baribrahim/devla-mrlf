# The Invisible Admin — Role Detection Mystery

## Background

You just joined **Dashly**, a startup building a SaaS analytics platform. The product team shipped the admin dashboard last sprint — it's supposed to let admins manage users, view analytics, and configure settings.

There's just one problem: **no one can find the admin button**.

It's Tuesday afternoon. The CTO — who is definitely an admin in the database — messages you:

> "Hey, I can't see the Admin Dashboard button anywhere. I've cleared cache, tried incognito, logged out and back in. Nothing. Can you check if we broke something?"

You check the frontend code. The button is there:

```javascript
{user.role === 'admin' && <button>Admin Dashboard</button>}
```

You check the database. The CTO's record shows `role: 'admin'`.

You check the login endpoint. Authentication works perfectly — tokens are issued, sessions are valid.

So why can't anyone see the admin button?

## Your Task

Find and fix the bug preventing admin users from seeing the Admin Dashboard button.

The system should:
- Issue JWT tokens that correctly identify each user's role
- Allow the frontend to decode the token and determine user capabilities
- Protect admin API routes from non-admin access
- Work correctly for all role types: `admin`, `moderator`, `user`

## What "Done" Looks Like

- All existing tests pass (`npm test`)
- Admins see the admin button; regular users don't
- Admin API routes correctly reject non-admin requests
- The fix works for all three role types, not just admin
- Token structure follows JWT best practices

## Constraints

**You must not:**
- Change the API contract (request/response shape)
- Modify the database schema or seed data
- Change the frontend role-checking logic (`user.role === 'admin'`)
- Modify any test files

**You must:**
- Preserve backward compatibility with existing clients
- Ensure the token contains only necessary user information
- Fix the root cause, not work around it

## Running the Project

```bash
npm install
npm test
```

## File Overview

```
src/
  server.js                    # Express app setup
  routes/auth.js               # Login and registration endpoints
  routes/admin.js              # Admin-only API endpoints
  routes/user.js               # User profile endpoints
  middleware/authenticate.js   # JWT verification middleware
  utils/jwt.js                 # Token signing and verification
  db/users.js                  # User repository (SQLite)
  db/database.js               # Database setup with seed data

public/
  index.html                   # Simple frontend to visualize the bug
  app.js                       # Frontend JavaScript (token decoding + UI)

tests/
  auth.visible.test.js         # Visible test suite
  helpers.js                   # Test utilities
```

## Notes

- The database is seeded with three users: an admin, a moderator, and a regular user
- The frontend decodes the JWT locally to display the user info — this is intentional
- Visible tests guide you, but hidden tests cover edge cases including different roles and permission boundaries
- The `/api/admin/stats` endpoint should only be accessible to admins

## Credentials for Testing

| Email | Password | Expected Role |
|-------|----------|---------------|
| admin@dashly.io | admin123 | admin |
| mod@dashly.io | mod123 | moderator |
| user@dashly.io | user123 | user |
