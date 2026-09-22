// Vercel serverless entry point
// This file exports the Express app as a module so Vercel can wrap it as a serverless function.
// Database connection is handled lazily in app.ts (per-request middleware).

import app from "../src/app";

export default app;
