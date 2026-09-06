const db = require("../config/db.js");

const GetDataRepository = require("../repositories/getData.repository.js"); 
const GetDataService = require("../services/getData.service.js");
const GetDataController = require("../controller/getData.js");

 const getDataRepository = new GetDataRepository(db);
 const getDataService = new GetDataService(getDataRepository);
 const getDataController = new GetDataController(getDataService);

 module.exports = getDataController;