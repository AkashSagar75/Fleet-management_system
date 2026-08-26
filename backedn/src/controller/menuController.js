const db = require('../config/db');

 

//  exports.getMenus = async (req, res) => {
//   try {

//     const { role_id, company_type_id } = req.params;

//     // Pehle role check karo
//     const [role] = await db.query(
//        "SELECT * FROM roles WHERE id = ?",
//       [role_id]
//     );
    
//     if (!role.length) {
//       return res.status(404).json({
//         success: false,
//         message: "Role not found"
//       });
//     }

//     let sql;
//     let params;

//     if (role[0].is_system_role) {

//       sql = `
//       SELECT DISTINCT
//           m.id,
//           m.name,
//           m.path,
//           m.icon,
//           m.parent_id,
//           m.sort_order
//       FROM menus m
//       JOIN menu_permissions mp
//           ON mp.menu_id = m.id
//       JOIN role_permissions rp
//           ON rp.permission_id = mp.permission_id
//       WHERE rp.role_id = ?
//       ORDER BY m.sort_order`;

//       params = [role_id];

//     } else {

//       sql = `
//       SELECT DISTINCT
//           m.id,
//           m.name,
//           m.path,
//           m.icon,
//           m.parent_id,
//           m.sort_order
//       FROM menus m
//       JOIN company_type_menus ctm
//           ON ctm.menu_id = m.id
//       JOIN menu_permissions mp
//           ON mp.menu_id = m.id
//       JOIN role_permissions rp
//           ON rp.permission_id = mp.permission_id
//       WHERE rp.role_id = ?
//       AND ctm.company_type_id = ?
//       ORDER BY m.sort_order`;

//       params = [role_id, company_type_id];

//     }

//     const [menus] = await db.query(sql, params);

//     return res.json({
//       success: true,
//       data: menus
//     });

//   } catch (err) {

//     return res.status(500).json({
//       success: false,
//       message: err.message
//     });

//   }
// };
 
exports.getMenus = async (req, res) => {
  try {
    const { role_id, company_type_id } = req.params;

    // Role check
    const [roles] = await db.query(
      "SELECT id, is_system_role FROM roles WHERE id = ?",
      [role_id]
    );

    if (!roles.length) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    const role = roles[0];

    let sql = "";
    let params = [];

    // =========================
    // SUPER ADMIN
    // =========================
    if (role.is_system_role == 1) {

      sql = `
        SELECT DISTINCT
            m.id,
            m.name,
            m.path,
            m.icon,
            m.parent_id,
            m.sort_order
        FROM menus m
        INNER JOIN menu_permissions mp
            ON mp.menu_id = m.id
        INNER JOIN role_permissions rp
            ON rp.permission_id = mp.permission_id
        WHERE rp.role_id = ?
          AND NOT EXISTS (
              SELECT 1
              FROM company_type_menus ctm
              WHERE ctm.menu_id = m.id
          )
        ORDER BY m.sort_order ASC
      `;

      params = [role_id];

    } else {

      // company_type_id required for company users
      if (!company_type_id) {
        return res.status(400).json({
          success: false,
          message: "company_type_id is required",
        });
      }

      sql = `
        SELECT DISTINCT
            m.id,
            m.name,
            m.path,
            m.icon,
            m.parent_id,
            m.sort_order
        FROM menus m
        INNER JOIN company_type_menus ctm
            ON ctm.menu_id = m.id
        INNER JOIN menu_permissions mp
            ON mp.menu_id = m.id
        INNER JOIN role_permissions rp
            ON rp.permission_id = mp.permission_id
        WHERE rp.role_id = ?
          AND ctm.company_type_id = ?
        ORDER BY m.sort_order ASC
      `;

      params = [role_id, company_type_id];
    }

    const [menus] = await db.query(sql, params);

    return res.json({
      success: true,
      data: menus,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};