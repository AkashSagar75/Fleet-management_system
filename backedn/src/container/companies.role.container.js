const db =  require("../config/db.js");

const CompaniesRoleRepository =   require("../repositories/companies.role.repository.js");

const CompanyRoleService =  require("../services/companies.role.service.js");

const CompaniesRoleController =  require("../controller/companies.role.controller.js");
 
const roleRepository =  new CompaniesRoleRepository(db);
 
const roleService =  new CompanyRoleService(roleRepository);
 
const roleController =  new CompaniesRoleController(roleService);
 
module.exports = roleController;