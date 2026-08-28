const db = require('../config/db');

class CreateCAdminUserRepository {
  constructor(db) {
    this.db = db;
  }

  async findByEmail(connection, email) {
    const [rows] = await connection.query(
      ` SELECT id FROM users  WHERE email = ? LIMIT 1  `,
      [email]
    );

    return rows[0] || null;
  };


  // async create( data) {
  //     const { companyId, firstName, lastName, email, password, phone,role_name} = data;

  //       const connection = await this.db.getConnection();
  //  try{
  //     await connection.beginTransaction();

  //       const sql = `insert into roles (company_id, role_name) values(?,?)`;

  //     const [roleResults] = await connection.query(sql,[companyId,role_name])
  //      const roleId = roleResults.insertId;

  //      const User_sql =   `  INSERT INTO users  ( company_id, role_id, first_name,  last_name, email,  password,   phone,  status, user_status )
  //          VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?) `;
  //           const [userResults] = await connection.query(User_sql,[  companyId, roleId, firstName, lastName, email, password, phone ])

  //            await connection.commit();
  //            return {
  //   userId: userResults.insertId,
  //   roleId: roleId
  // };

  //  }
  //  catch(err)
  //  {
  // await connection.rollback();
  // throw err;
  //  }
  //  finally{
  //      connection.release();
  //  }



  // };
  async create(connection, data) {

    const { companyId,userId, firstName, lastName, email, password, phone, role_name,Roleid, action } = data;


    if (action == true) {
      const [roleResult] = await connection.query(
        ` INSERT INTO roles  (  company_id,  role_name  ) VALUES (?, ?)  `,
        [companyId, role_name]
      );
      const roleId = roleResult.insertId;
      // 2️⃣ User insert
      const [userResult] = await connection.query(
        ` INSERT INTO users ( company_id, role_id, first_name, last_name, email, password, phone,
      status,
      user_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'active')
    `,
        [companyId, roleId, firstName, lastName, email, password, phone]
      );

      return { userId: userResult.insertId, roleId, message: "User created successfully", };
    }
    else {
      const [existingUser] = await connection.query(
        `SELECT id  FROM users 
      WHERE id = ? AND company_id = ? AND role_id = ?
    `,
        [userId, companyId,Roleid]
      );
      if (existingUser.length === 0) {
        throw new Error("User not found");
      }
      const [userResult] = await connection.query(
        ` UPDATE users  SET first_name = ?,  last_name = ?, email = ?,  phone = ?
    WHERE id = ? AND company_id = ? AND Role_id = ?
    `,
        [firstName, lastName, email, phone, userId, companyId,Roleid]
      );

      return {
        userId,
        userResult,
        message: "User updated successfully"
      };

    }
  }

}

module.exports = CreateCAdminUserRepository
