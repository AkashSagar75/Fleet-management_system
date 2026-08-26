const companyRoleService = require( "../services/companies.role.service.js");

class CompaniesRoleController {
  constructor(companyRoleService) {
    this.companyRoleService = companyRoleService;
  }
  getRolesByCompanyCode = async (req, res) => {
    try {
     const roles = await this.companyRoleService.getRolesByCompanyCode();
      res.status(200).json({ roles });
    } catch (error) {
       console.error("Error fetching roles:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
  module.exports = CompaniesRoleController;