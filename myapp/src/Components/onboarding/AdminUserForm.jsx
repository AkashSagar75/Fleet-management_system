const AdminUserForm = ({
  data,
  roles,
  onChange,
  onNext,
  onBack,
}) => {

  return (
    <div className="company-card">

      <div className="company-header">

        <h1 className="company-title">
          Create Admin User & Role
        </h1>

        <p className="company-subtitle">
          Setup your company admin account and assign role
        </p>

      </div>

      <form className="user-role-form">

        <div className="form-group">

          <label>
            First Name
          </label>

          <div className="input-wrap">

            <input
              type="text"
              name="first_name"
              value={data.first_name}
              placeholder="Enter first name"
              onChange={(event) =>
                onChange("user", event)
              }
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            Last Name
          </label>

          <div className="input-wrap">

            <input
              type="text"
              name="last_name"
              value={data.last_name}
              placeholder="Enter last name"
              onChange={(event) =>
                onChange("user", event)
              }
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            Select Role
          </label>

          <div className="input-wrap">

            <select
              name="role_id"
              value={data.role_id ?? ""}
              onChange={(event) =>
                onChange("user", event)
              }
            >

              <option value="">
                Select Role
              </option>

              {roles.map((role) => (
                <option
                  key={role.id}
                  value={role.id}
                >
                  {role.role_name}
                </option>
              ))}

            </select>

          </div>

        </div>

        <div className="form-group">

          <label>
            Phone
          </label>

          <div className="input-wrap">

            <input
              type="text"
              name="phone"
              value={data.phone}
              placeholder="Enter phone"
              onChange={(event) =>
                onChange("user", event)
              }
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            Admin Email
          </label>

          <div className="input-wrap">

            <input
              type="email"
              name="email"
              value={data.email}
              placeholder="Enter email address"
              onChange={(event) =>
                onChange("user", event)
              }
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            Password
          </label>

          <div className="input-wrap">

            <input
              type="password"
              name="password"
              value={data.password}
              placeholder="Enter password"
              onChange={(event) =>
                onChange("user", event)
              }
            />

          </div>

        </div>

        <div className="role-btns">

          <button
            type="button"
            className="back-btn"
            onClick={onBack}
          >
            Back
          </button>

          <button
            type="button"
            className="next-btn"
            onClick={onNext}
          >
            Next
          </button>

        </div>

      </form>

    </div>
  );
};

export default AdminUserForm;