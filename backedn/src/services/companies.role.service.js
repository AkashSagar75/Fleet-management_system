const CompaniesRoleRepository  = require('../repositories/companies.role.repository.js');
class companyRoleService {
constructor(CompaniesRoleRepository) {
    this.CompaniesRoleRepository = CompaniesRoleRepository; 

}
async getRolesByCompanyCode( ) {
 try{
     const roles = await this.CompaniesRoleRepository.getRoles();
    return roles;
} catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
}
}
}
 module.exports = companyRoleService;