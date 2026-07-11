const db = require('../config/db');

 

 exports.getMenus = async (req, res) => {
  try {

    const { role_id, company_type_id } = req.params;

    // Pehle role check karo
    const [role] = await db.query(
       "SELECT * FROM roles WHERE id = ?",
      [role_id]
    );
    
    if (!role.length) {
      return res.status(404).json({
        success: false,
        message: "Role not found"
      });
    }

    let sql;
    let params;

    if (role[0].is_system_role) {

      sql = `
      SELECT DISTINCT
          m.id,
          m.name,
          m.path,
          m.icon,
          m.parent_id,
          m.sort_order
      FROM menus m
      JOIN menu_permissions mp
          ON mp.menu_id = m.id
      JOIN role_permissions rp
          ON rp.permission_id = mp.permission_id
      WHERE rp.role_id = ?
      ORDER BY m.sort_order`;

      params = [role_id];

    } else {

      sql = `
      SELECT DISTINCT
          m.id,
          m.name,
          m.path,
          m.icon,
          m.parent_id,
          m.sort_order
      FROM menus m
      JOIN company_type_menus ctm
          ON ctm.menu_id = m.id
      JOIN menu_permissions mp
          ON mp.menu_id = m.id
      JOIN role_permissions rp
          ON rp.permission_id = mp.permission_id
      WHERE rp.role_id = ?
      AND ctm.company_type_id = ?
      ORDER BY m.sort_order`;

      params = [role_id, company_type_id];

    }

    const [menus] = await db.query(sql, params);

    return res.json({
      success: true,
      data: menus
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }
};
 