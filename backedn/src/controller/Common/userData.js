const  db = require("../../config/db");

exports.getUserData = async (req, res) => {
try
{   
     const { id } = req.query;
    const sql = `  SELECT *  FROM users  where id = ? `;
    const [rows] = await db.query(sql);
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