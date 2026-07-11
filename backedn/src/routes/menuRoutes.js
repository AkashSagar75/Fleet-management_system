const express = require('express');
const router = express.Router();

 const menuapi = require('../controller/menuController')
const {verifyAccessToken} = require('../midllerware/auth.middleware')

router.get('/getMenus/:role_id/:company_type_id',menuapi.getMenus);
 
 

module.exports = router;