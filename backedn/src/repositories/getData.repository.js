 const db = require("../config/db.js");

class GetDataRepository {
  constructor(db) {
    this.db = db;
  }
   async getData({ tableName, companyId, page = 1, limit =50 ,
    search = "", searchColumns = []
   })
   {
   let sql = `SELECT * FROM ${tableName}
    WHERE company_id = ${companyId}`;
    const params = [];

    if (search && searchColumns.length > 0) {

    const searchConditions = searchColumns.map(
      (column) => `${tableName}.${column} LIKE ?`
    );
    sql += ` AND (${searchConditions.join(" OR ")})`;
     searchColumns.forEach(() => {
      params.push(`%${search}%`);
    });
    const offset = (page - 1) * limit;
    sql += ` LIMIT ${limit} OFFSET ${offset}`;
       
   }
   const [rows] = await this.db.query(sql);
   return rows;

  }

}

 module.exports = GetDataRepository;