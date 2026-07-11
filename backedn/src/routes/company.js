 
const express = require('express');
const router = express.Router();

const onboardingApi = require('../controller/onboarding/onboarding')
const {verifyAccessToken} = require('../midllerware/auth.middleware')

router.post('/createCompany',  onboardingApi.createCompany);
router.post('/onboarding', onboardingApi.onboarding);
router.get('/getrole', onboardingApi.getrole);
router.get('/companytypes', onboardingApi.companytypes);

module.exports = router;