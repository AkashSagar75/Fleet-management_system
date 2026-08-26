const db=require("../config/db");

const authorize=(permission)=>{

return async(req,res,next)=>{

const roleId=req.user.roleId;

const [rows]=await db.query(`
SELECT p.name
FROM role_permissions rp
JOIN permissions p
ON p.id=rp.permission_id
WHERE rp.role_id=?
`,[roleId]);

const permissions=rows.map(x=>x.name);

if(!permissions.includes(permission))
{
return res.status(403).json({
message:"Permission Denied"
});
}

next();

};

};

module.exports=authorize;