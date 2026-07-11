const db = require('../config/db');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const clientRedis = require('../config/redis')
const {userQueue} = require('../queue/userqueue');
 

const {generateAccessToken,generateRefreshToken }= require('../utils/token')
const {transtportmail,sendOtp,resetPassword} = require('../utils/sendEmail');


exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // ✅ promise style query
     const [results] = await db.query(`
 SELECT
    u.id,
    u.company_id,
    u.role_id,
    u.first_name,
    u.last_name,
    CONCAT(u.first_name, ' ', u.last_name) AS name,
    u.email,
    u.password,
    c.company_type_id
FROM users u
LEFT JOIN companies c
    ON u.company_id = c.id
WHERE u.email = ?
`, [email]);

    if (!results.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

     const isMatch = await bcrypt.compare(password, user.password);

    // if (!isMatch) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }

    if (password !== user.password) {
  return res.status(401).json({
    message: "Invalid credentials"
  });
}
    // 🔐 tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

     const hashedToken = await bcrypt.hash(refreshToken,10);

    // ✅ save refresh token
    await db.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
      [user.id, hashedToken]
    );

     await clientRedis.set(
    `session:${user.id}`,
    JSON.stringify({
        id: user.id,
        role_id: user.role_id,
        role_name: user.role_name,
        company_id: user.company_id,
        company_type_id: user.company_type_id,
        email: user.email,
        name: user.name,
        is_system_role: user.is_system_role
    }),
    {
        EX: 86400
    }
);
   
   return res.status(200).json({
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name,
        company_id: user.company_id,
        company_type_id: user.company_type_id,
        is_system_role: user.is_system_role
    }
});

  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: "Invalid email or password",
      error: err.message
    });
  }
};
exports.getrole = async (req, res) => {
  try {

    const userId = req.params.id;

    const sql = `
      SELECT
        u.id,
        u.role_id,
        r.role_name,
        r.is_system_role,
        u.company_id,
        c.company_name,
        c.company_type_id,
        ct.name AS company_type
      FROM users u
      INNER JOIN roles r
        ON r.id = u.role_id
      LEFT JOIN companies c
        ON c.id = u.company_id
      LEFT JOIN company_types ct
        ON ct.id = c.company_type_id
      WHERE u.id = ?
        AND u.status = 1
        AND r.status = 1
    `;

    const [result] = await db.query(sql, [userId]);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: result[0]
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
exports.refreshToken = async (req, res)=>{
  const { refreshToken } = req.body;
  const sql = "SELECT * FROM refresh_tokens WHERE token = ?";
     const [row] = db.query(sql,[refreshToken]);
     if(!row.length){
      return res.status(403).json({ message: "Invalid refresh token" });
     }

     const decoded = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);

     
     db.query(
    "DELETE FROM refresh_tokens WHERE token = ?",
    [refreshToken]
  );
  const newAccessToken = generateAccessToken({ id: decoded.id });
  const newRefreshToken = generateRefreshToken({ id: decoded.id });
  await db.query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
    [decoded.id, newRefreshToken]
  );
  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  });

}
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  await db.query(
    "DELETE FROM refresh_tokens WHERE token = ?",
    [refreshToken]
  );

  res.json({ message: "Logout success" });
};
exports.forgetPassword = async(req,res)=>{
  try {
    const {email} = req.body;
    const [userData] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if(!userData.length){
       return res.status(404).json({message: "User not found"});
    }
    const user = userData[0]; 

    const otp = Math.floor(100000 + Math.random() *900000).toString();
    await clientRedis.set(
      `resetOtp:${email}`,
      otp,
      {
        EX: 600
      })

    // const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    // await db.query('INSERT INTO password_resets (email, otp, expires_at)  VALUES (?, ?, NOW() + INTERVAL 10 MINUTE)',
    // [email,otp])

     console.log("OTP:", otp); 
    await sendOtp(email, otp);
     return res.json({
      message: "OTP sent successfully 🔥"
    });
  } catch (error) {
     console.error(error);  
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}
exports.verifyOtp = async(req,res)=>{
  try {
    const {email,otp}= req.body;
    const storedOtp = await clientRedis.get(
      `resetOtp:${email}`
    );
    if (!storedOtp) {
      return res.status(401).json({
        message: "OTP expired"
      });
    }
    if (storedOtp !== otp) {
      return res.status(401).json({
        message: "Invalid OTP"
      });
    }
    await clientRedis.set(
      `verified:${email}`,
      "true",
      {
        EX: 600
      }
    );
  
      res.json({ 
        success: true,
     message: "OTP verified ✅" 
      
      });
  } catch (error) {
     res.status(500).json({ error: error.message });
  }
}
exports.resetPassword  = async(req, res)=>{  
  try {
    const {email, password} = req.body;

    const isVerified = await clientRedis.get(

      `verified:${email}`

    );

    if (!isVerified) {

      return res.status(401).json({

        message: "OTP verification required"

      });

    }
   
     const hashedPassword = await bcrypt.hash(

      password,

      8

    );
     
    
    const [userData] = await db.query("UPDATE users SET password = ? WHERE email = ?",
       [hashedPassword,email]);

  if (userData.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }
   clientRedis

    await clientRedis.del(

      `resetOtp:${email}`

    );

    await clientRedis.del(

      `verified:${email}`

    );
      res.json({

      message: "Password reset successful 🔥"

    });
     
     await resetPassword(email)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 }
