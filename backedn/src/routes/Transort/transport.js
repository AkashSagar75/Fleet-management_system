  
 const express = require('express');
 const router = express.Router();
 
 const user_Controllerapi = require('../../container/Create_by_CAdmin.user.container')
 
 const {verifyAccessToken} = require('../../midllerware/auth.middleware');
 const vehicleController = require('../../controller/Transport/vehicle');
 router.get('/getVehicleTypes',verifyAccessToken, vehicleController.getVehicleTypes);
 router.post('/vehicleTypeAction',verifyAccessToken, vehicleController.vehicleTypeAction);
 router.post('/createUser',verifyAccessToken,user_Controllerapi.createUser );


 module.exports = router;