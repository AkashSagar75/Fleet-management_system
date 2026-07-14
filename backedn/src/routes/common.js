 
const express = require('express');
const router = express.Router();

 
const {verifyAccessToken} = require('../midllerware/auth.middleware');
const commonAPI = require('../controller/Common/userData');

router.get('/getUserData',  commonAPI.getUserData);
 

module.exports = router;