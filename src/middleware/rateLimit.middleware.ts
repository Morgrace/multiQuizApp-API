import rateLimit from "express-rate-limit";
import type { RequestHandler } from "express";

// Global gentle limiter (memory-based)
export const globalLimiter: RequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again in an hour!",
  },
});

// Strict auth limiter for login/reset/signup
export const strictAuthLimiter: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    status: "fail",
    message: "Too many authentication attempts. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts
  handler: (req, res) => {
    const retryAfter = Math.ceil(Number(req.rateLimit.resetTime) / 1000);
    res.set("Retry-After", String(retryAfter));
    res.status(429).json({
      status: "error",
      message: "Too many authentication attempts",
      retryAfter: retryAfter,
    });
  },
});

// Password reset specific (even stricter)
export const passwordResetLimiter: RequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Only 3 password resets per hour
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: {
    status: "fail",
    message: "Too many password reset attempts. Please try again later.",
  },
});
