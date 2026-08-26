const db = require("../../config/db");


exports.getVehicleTypes = async (req, res) => {
  try {
    const { company_id, created_by, page , id, name,  description,  status, created_at, updated_at,  limit , } = req.query;
       const offset = (Number(page) - 1) * Number(limit);
     let where =`Where is_deleted =0 AND company_id =? AND  created_by=?`;

 let params = [company_id, created_by];
 console.log("page =", page);
console.log("limit =", limit);
console.log("offset =", offset);
console.log("params =", [...params, Number(limit), offset]);

 if(id){
  where += `AND id =?`
  params.push(id);
 }
 if(name){
  where += `AND name LIKE ?`
  params.push(`%${name}%`);
 }

  if(description){
  where += `AND description LIKE ?`
  params.push(`%${description}%`);
 }

 if (status) {
      where += ` AND status = ?`;
      params.push(status);
    }

    if (created_at) {
      where += ` AND DATE(created_at) = ?`;
      params.push(created_at);
    }

    if (updated_at) {
      where += ` AND DATE(updated_at) = ?`;
      params.push(updated_at);
    }

     const [countResult] = await db.query(
      `SELECT COUNT(*) AS total
       FROM vehicle_types
       ${where}`,
      params
    );
       
      const [rows] = await db.query(
      `
      SELECT *
      FROM vehicle_types
      ${where}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
      `,
      [...params, Number(limit), offset]
    );
     
    return res.status(200).json({
      success: true,
      data: rows,
       pagination: {
        total: countResult[0].total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(countResult[0].total / Number(limit)),
      },
    });
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.vehicleTypeAction = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { action,  id,  name,  description,  company_id, status,  created_by, updated_by } = req.body;

    switch (action) { 
       case "create": { 
        const [result] = await connection.query(
          `INSERT INTO vehicle_types (company_id, name,  description, status,  created_by ) VALUES (?, ?, ?, ?, ?) `,
          [ company_id,  name,   description, status, created_by]
        );

        await connection.commit();

        return res.status(201).json({
          success: true,
          message: "Vehicle Type Created Successfully",
          id: result.insertId
        });
      }

      case "update": {

        await connection.query(
          `UPDATE vehicle_types SET  name=?,   description=?,  status=?, updated_by=?, updated_at=NOW()  WHERE id=?`,
          [  name, description,  status, updated_by,  id  ]
        );

        await connection.commit(); 
        return res.json({
          success: true,
          message: "Vehicle Type Updated Successfully"
        });
      }

      case "delete": {
        await connection.query(`UPDATE vehicle_types  SET is_deleted = 1  WHERE id = ?`, [id]  );
        await connection.commit();
          return res.json({
          success: true,
          message: "Vehicle Type Deleted Successfully"
        });
      }
      default:
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "Invalid Action"
        });

    }

  } catch (error) {

    await connection.rollback();
 
    return res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {
    connection.release(); 
   }
}
