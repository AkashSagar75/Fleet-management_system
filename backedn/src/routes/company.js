 
const express = require('express');
const router = express.Router();

const onboardingApi = require('../controller/onboarding/onboarding')
const {verifyAccessToken} = require('../midllerware/auth.middleware')
const  roleapi = require('../container/companies.role.container.js')
const user_Controllerapi = require('../container/Create_by_CAdmin.user.container.js')
 
router.post('/onboarding', verifyAccessToken,onboardingApi.onboarding);
router.get('/getcompaniesrole', verifyAccessToken, roleapi.getRolesByCompanyCode);
router.get('/companytypes',verifyAccessToken, onboardingApi.companytypes);
router.get('/getFeatrues', verifyAccessToken, onboardingApi.getFeatrues);
router.post('/createUser/:id',user_Controllerapi.createUser );

module.exports = router;