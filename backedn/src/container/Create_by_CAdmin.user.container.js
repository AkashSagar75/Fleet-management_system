const db =  require("../config/db.js");

const create_user_services = require('../services/Create_by_CAdmin.user.service.js');
const Create_by_CAdmin_user_Controller = require('../controller/Create_by_CAdmin.user.js');
const CreateCAdminUserRepository  =  require('../repositories/Create_by_CAdmin.user.repository.js');




const  UserRepository =  new CreateCAdminUserRepository(db);
const  user_services =  new create_user_services(UserRepository);
const  user_Controller =  new Create_by_CAdmin_user_Controller(user_services);

module.exports = user_Controller;
