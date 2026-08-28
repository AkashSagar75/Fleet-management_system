 const bcrypt = require("bcryptjs");

class CreateUserServices {

  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async createuser(connection, companyId, data) {

    const {
      role_name,
      first_name,
      last_name,
      email,
      phone,
      password,
      userId,
      Roleid,
      action
    } = data;


    // Only new users need the duplicate-email lookup.
    if (action == true) {
      const existingUser = await this.userRepository.findByEmail(connection, email);

      if (existingUser) {
        const error = new Error("Email already exists");
        error.statusCode = 409;
        throw error;
      }
    }


    // 2️⃣ Password hash

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // 3️⃣ Repository

    const result =
      await this.userRepository.create(
        connection,
        {
          companyId,
          role_name,
          firstName: first_name,
          lastName: last_name,
          email,
          phone,
          password: hashedPassword,
          userId,
          Roleid,
          action
        }
      );


    // 4️⃣ Response

    return {
      id: result.userId,
      company_id: companyId,
      role_id: result.roleId,
      role_name,
      first_name: first_name,
      last_name: last_name,
      email,
      phone
    };
  }
}

module.exports = CreateUserServices;