import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import config from "./config";

const app: Application = express();

// Set up CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // 1. Allow non-browser requests (Postman, mobile apps, server-to-server)
      if (!origin) return callback(null, true);

      // 2. Check if origin is allowed or is any Vercel preview/production URL
      const isAllowed =
        config.client_urls.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.endsWith(".vercel.app");

      if (isAllowed) {
        return callback(null, true);
      }

      // DO NOT pass new Error() here — pass false so it doesn't crash the preflight
      return callback(null, false);
    },
    credentials: true, // Allows sending cookies & auth headers
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    // Omit allowedHeaders so that it automatically mirrors whatever headers the client requests
    optionsSuccessStatus: 200, // Legacy browser compatibility
  })
);
// --- CUSTOM VERCEL CORS MIDDLEWARE ---
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;

  // 1. Check if origin is allowed (using your exact logic)
  const isAllowed =
    !origin || // Allow non-browser tools like Postman/curl
    config.client_urls.includes(origin) ||
    origin.startsWith("http://localhost:") ||
    origin.startsWith("http://127.0.0.1:") ||
    origin.endsWith(".vercel.app");

  // 2. Attach Origin and Credentials headers if allowed
  if (isAllowed && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  // 3. Explicitly define Allowed Methods & Headers
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  // Ensure "Content-Type" and "Authorization" are allowed
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");

  // 4. IMMEDIATELY resolve OPTIONS (Preflight) requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return; // Crucial: stops the request here so Vercel doesn't get confused
  }

  next();
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "DevShare API Server is operational 🚀",
    version: "1.0.0",
    environment: config.env,
  });
});

// API Routes
app.use("/api/v1", router);
app.use("/api", router);

// Global Error Handler
app.use(globalErrorHandler);

// Handle 404 Not Found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API endpoint not found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: `Cannot ${req.method} ${req.originalUrl}`,
      },
    ],
  });
});

export default app;