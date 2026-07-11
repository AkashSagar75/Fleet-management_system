const express = require('express');
const router = express.Router();
const loginLimiter = require('../midllerware/rateLimit')

const authApi =  require('../controller/auth')
const {verifyAccessToken} = require('../midllerware/auth.middleware')
router.post('/userLogin', loginLimiter , authApi.userLogin);
router.get('/getrole/:id',verifyAccessToken,authApi.getrole)
router.post("/refreshToken", authApi.refreshToken);
router.post('/forgetPassword', authApi.forgetPassword);
router.post('/verifyOtp', authApi.verifyOtp);
router.delete('/logout', authApi.logout);
router.post('/resetPassword', authApi.resetPassword);

module.exports = router;