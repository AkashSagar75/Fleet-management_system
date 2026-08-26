const db = require('../config/db.js');

 class CompaniesRoleRepository  {
  constructor(db) {
    this.db =db;
  }
     async getRoles()
      {
         try {
        const sql = `SELECT
    c.id AS company_id,
    c.company_type_id,
    c.company_name,
    c.company_code,

    r.id AS role_id,
    r.role_name,
    r.status AS role_status

FROM companies AS c

INNER JOIN roles AS r
    ON r.company_id = c.id

WHERE
    r.status = 1

ORDER BY
    c.id,
           r.id;`
        const [rows] = await this.db.query(sql);
       
        return rows;
         } catch (error) {
            console.error("Error fetching roles:", error);
            throw error;
         }
      }
 }
 module.exports = CompaniesRoleRepository;