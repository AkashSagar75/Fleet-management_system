const db = require('../config/db');

class CreateCAdminUserRepository {
    constructor(db) {
        this.db = db;
    }

    async findByEmail(email) {
        const [rows] = await db.query(
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

  const {
    companyId,
    firstName,
    lastName,
    email,
    password,
    phone,
    role_name
  } = data;

  // 1️⃣ Role insert
  const [roleResult] = await connection.query(
    `
    INSERT INTO roles
    (
      company_id,
      role_name
    )
    VALUES (?, ?)
    `,
    [companyId, role_name]
  );

  const roleId = roleResult.insertId;

  // 2️⃣ User insert
  const [userResult] = await connection.query(
    `
    INSERT INTO users
    (
      company_id,
      role_id,
      first_name,
      last_name,
      email,
      password,
      phone,
      status,
      user_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'active')
    `,
    [
      companyId,
      roleId,
      firstName,
      lastName,
      email,
      password,
      phone
    ]
  );

  return {
    userId: userResult.insertId,
    roleId
  };
}

    async findById(db, userId, companyId) {
        const [rows] =
            await db.query(
                ` SELECT u.id,
                  u.company_id,  
                   u.role_id, 
                    FROM users u 
                    INNER JOIN roles r
                     ON r.id = u.role_id 
                   WHERE u.role_id = ?
                    AND u.company_id = ?  LIMIT 1  `,
                [ userId, companyId,   ]
            );

        return rows[0] || null;
    };

    async findAll(db, { companyId, limit, cursor, }) {
        let query = `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone,
      u.user_status,
      u.created_at,
      r.role_name
    FROM users u

    INNER JOIN roles r 
    ON r.id = u.role_id

    WHERE u.company_id = ?  `;
        const params = [companyId];
        if (cursor) {
            query += `  AND u.id < ?  `;
            params.push(cursor);
        }

        query += ` ORDER BY u.id DESC LIMIT ? `;

        params.push(limit);

        const [rows] =  await db.query( query,  params  );

        return rows;
    };


    //   async update  (  db, userId, companyId,  data  ) {
    //       const {  roleId,  firstName,  lastName, phone, userStatus,  } = data;
    //     const [result] =   await connection.query(
    //             ` UPDATE users SET  role_id = ?,
    //     first_name = ?,
    //     last_name = ?,
    //     phone = ?,
    //     user_status = ?

    //   WHERE id = ?
    //     AND company_id = ?
    //   `,
    //             [
    //                 roleId,
    //                 firstName,
    //                 lastName,
    //                 phone,
    //                 userStatus,
    //                 userId,
    //                 companyId,
    //             ]
    //         );

    //     return result.affectedRows;
    // };

    //   async  deleteById( connection, userId,  companyId ) {

    //     const [result] = await connection.query(
    //             ` DELETE FROM users   WHERE id = ?  AND company_id = ?  `,
    //             [  userId,   companyId, ]
    //         );

    //     return result.affectedRows;
    // };






}

module.exports = CreateCAdminUserRepository


// module.exports = {
//     findByEmail,
//     create,
//     findById,
//     findAll,
//     update,
//     deleteById,
// };