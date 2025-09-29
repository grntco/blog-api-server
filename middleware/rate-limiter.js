import { rateLimit } from "express-rate-limit";

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests from this IP. Try again after 15 minutes.",
    });
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message:
        "Too many login attempts from this IP. Try again after 15 minutes.",
    });
  },
  skipSuccessfulRequests: true,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 3,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message:
        "Too many accounts created from this IP. Try again after 1 hour.",
    });
  },
});

export { generalLimiter, loginLimiter, registerLimiter };
