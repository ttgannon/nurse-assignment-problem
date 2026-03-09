import express from "express";
import cors from "cors";
import session from "express-session";
import { authRouter } from "./routes/auth";
import { nursesRouter } from "./routes/nurses";
import { patientsRouter } from "./routes/patients";
import { unitsRouter } from "./routes/units";

export const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "http://localhost:5174")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server calls (no origin header) and allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true, // Required for session cookies
  })
);

// ─── Body parsing ─────────────────────────────────────────────────────────────

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Session ──────────────────────────────────────────────────────────────────

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required.");
}

app.use(
  session({
    name: "nursify.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // In production the app must run behind HTTPS; set secure: true
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      // 8 hours — one nursing shift
      maxAge: 8 * 60 * 60 * 1000,
    },
  })
);

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/auth", authRouter);
app.use("/api/nurses", nursesRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/units", unitsRouter);

// ─── Health check ─────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => res.json({ ok: true }));

// ─── 404 handler ─────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ─── Global error handler ─────────────────────────────────────────────────────

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: err.message ?? "Internal server error" });
  }
);
