 
const express = require('express');
const router = express.Router();

const getDataApi = require('../container/getdata.container..js');
const {verifyAccessToken} = require('../midllerware/auth.middleware');
const validateGetData = require('../validations/getData.validation.js');
const commonAPI = require('../controller/Common/userData');

router.get('/getUserData',  commonAPI.getUserData);
 router.get(  '/getData',  validateGetData, getDataApi.getData.bind(getDataApi)
);
 

module.exports = router;