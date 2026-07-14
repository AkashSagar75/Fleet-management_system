const db = require("../../config/db");


exports.getVehicleTypes = async (req, res) => {
try
{
   const {company_id, created_by } = req.query;
     console.log(req.query);
const sql = `  SELECT *  FROM vehicle_types WHERE company_id = ? AND created_by = ?  ORDER BY id DESC`;
const [rows] = await db.query(sql, [company_id, created_by]);
 return res.status(200).json({
    success: true,
    data: rows,
  });
}
catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message,
      });
}
}
   
