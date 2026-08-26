 
 
const mysql = require("mysql2/promise");

const db = mysql.createPool({  
host: 'localhost'|| process.env.DB_HOST,
user:  'root'|| process.env.DB_USER ,
password:'1234@123' || process.env.DB_PASSWORD,
database:'fleet_managess'|| process.env.DB_NAME, 
port: 3306 || process.env.DB_PORT,

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