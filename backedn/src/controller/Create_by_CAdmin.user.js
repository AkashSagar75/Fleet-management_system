 const db = require("../config/db");

class Create_by_CAdmin_user_Controller {

  constructor(create_user_services) {
    this.create_user_services = create_user_services;
  }

  createUser = async (req, res) => {

    const { companyId } = req.body;

    const connection = await db.getConnection();

    try {

      await connection.beginTransaction();

      const user =
        await this.create_user_services.createuser(
          connection,
          companyId,
          req.body
        );

      await connection.commit();

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user
      });

    } catch (error) {

      await connection.rollback();

      console.error(
        "Create User Error:",
        error
      );

      return res.status(
        error.statusCode || 500
      ).json({
        success: false,
        message: error.message
      });

    } finally {

      connection.release();
    }
  };
}

module.exports = Create_by_CAdmin_user_Controller;