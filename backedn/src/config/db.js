// const mysql = require('mysql2');

// const db = mysql.createConnection({
//    host: 'localhost',
//   user: 'root',
//   password: '1234@123',
//   database: 'fleet_manages',
//    port: 3306
// })

// db.connect((err)=>{
//      if (err) {
//     console.error('DB Connection Failed:', err);
//   } else {
//     console.log('Connected to MySQL');
//   }
// })
 
const mysql = require("mysql2/promise");

const db = mysql.createPool({  

  host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
port: process.env.DB_PORT || 3306,

   waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
  }
})()



module.exports = db;

// module.exports = db;