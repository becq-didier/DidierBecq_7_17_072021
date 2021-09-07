const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limiter jusqu'à 10 demandes
    message: "Too many accounts created from this IP, please try again after an hour",
});

module.exports = limiter;