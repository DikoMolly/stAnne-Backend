
const rateLimit = require("express-rate-limit");

// Create a rate limiter middleware
const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,  //2 minutes
  max: 5, // Number of allowed requests within the window
  message: "Too many failed login attempts. Please try again after 2 minutes.",
});

module.exports = loginLimiter;