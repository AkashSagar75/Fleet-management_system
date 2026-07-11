const reteLimit = require('express-rate-limit');

const loginLimiter   = reteLimit({
    windowMs: 15*60*100,
    max: 3,
    message: "Too many login attempts"
})
module.exports = loginLimiter;