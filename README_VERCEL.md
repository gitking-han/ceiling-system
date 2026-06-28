Deployment and Vercel instructions

1. Connect this repository to Vercel.
2. In the Vercel project settings -> Environment Variables, add:
   - `MONGODB_URI` -> your MongoDB connection string
   - `ADMIN_USERNAME` -> optional admin username (default `admin`)
   - `ADMIN_PASSWORD` -> optional admin password (default `admin`)
   - `ADMIN_NAME` -> optional admin display name

3. Vercel will detect Next.js automatically. Build command: `npm run build`.
4. No custom server is required; API routes live under `pages/api` and run serverless.
