# Product Browser Backend

A simple Node.js backend for browsing products with MySQL.

## Files

- `src/db.js` — database connection helper
- `src/server.js` — Express API server
- `scripts/seed.js` — database seed script
- `public/index.html` — static frontend page
- `.env` — local environment variables

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Update `.env` with your MySQL settings.
3. Seed the database:
   ```bash
   npm run seed
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
