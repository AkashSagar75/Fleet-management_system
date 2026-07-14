  
 const express = require('express');
 const router = express.Router();
 
 
 const {verifyAccessToken} = require('../../midllerware/auth.middleware');
 const vehicleController = require('../../controller/Transport/vehicle');
 
 
 router.get('/getVehicleTypes',verifyAccessToken, vehicleController.getVehicleTypes);
 
 module.exports = router;