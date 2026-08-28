import React, { useState } from "react";
import CommonTable from '../../commonComponents/CommonTable'
import { CreateUser } from '../../Api/Transport/transport.js'
import { useSelector } from "react-redux";
import notificationService from "../../Common/notificationService.js";

const userColumns = [
  {
    key: "name",
    label: "User",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "role",
    label: "Role",
  },
  {
    key: "phone",
    label: "Phone",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "createdAt",
    label: "Created On",
  },
];
export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState('Add')
  const user = useSelector((state) => state.user);
  const initialFormData = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    role_name: "",
    status: "",
    user_status: "active",
    action: true, // Add
  };
  const [formdata, setFormData] = useState(initialFormData)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }))
  }


  const handleEdit = (row) => {
    console.log("Edit User:", row);

    setMode("Edit");

    setFormData({
      first_name: row?.first_name || "",
      last_name: row?.last_name || "",
      email: row?.email || "",
      password: "",
      phone: row?.phone || "",
      role_name: row?.role_name || "",
      status: row?.status || "",
      user_status: row?.user_status || "active",
      userId: row?.id,
      action: false,
      Roleid: row?.role_id || null,
    });

    setOpenModal(true);
  };
  const handleDelete = (row) => {
    console.log("Delete User:", row);
    };

  const handlePageChange = (page) => {
    console.log("Page:", page);
  };

  const handleAddUser = () => {
    setMode("Add");
    setFormData({
      ...initialFormData,
      action: true,
    });

    setOpenModal(true);

  };
  const okButton = async (e) => {
    e.preventDefault();
    const companyId = user?.company_id;
    if (!companyId) {
      notificationService.error("Company information is missing. Please log in again.");
      return;
    }

    const Payload = {
      ...formdata,
      companyId,
      Roleid: formdata.Roleid || user?.role_id || null,
    };

    setLoading(true);
    try {
      const response = await CreateUser(Payload);
      if (response) {
        const savedUser = response?.data || response;
        setUsers((currentUsers) => {
          if (Payload.action) return [...currentUsers, savedUser];
          return currentUsers.map((currentUser) =>
            currentUser.id === Payload.userId ? savedUser : currentUser
          );
        });
        setOpenModal(false);
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error("User operation failed:", error);
      notificationService.error({
        message: "Something went wrong",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to process user request.",
      });

    }
    finally {
      setLoading(false);
    }


  }
  return (
    <>

      <div className="pages_container">

        <h1>Create User & Role </h1>

        <CommonTable
          columns={userColumns}
          data={users}
          loading={loading}
          actions={[
            {
              key: "Edit",
              label: "Edit",
              icon: "✏️",
              onClick: handleEdit,
            },
            {
              key: "delete",
              label: "Delete",
              icon: "🗑️",
              type: "delete",
              onClick: handleDelete,
            },
          ]}
          addButton={{
            label: "Add New",
            onClick: handleAddUser,
          }}
          pagination={{
            page: 1,
            total: 22,
            totalPages: 3,
          }}
          onPageChange={handlePageChange}
        />
      </div>
      {openModal && (
        <div className="modal_overlay">
          <div className="modal_box">

            {/* Header */}
            <div className="Header">
              <h2> {mode === "Add" ? "Add User" : mode === "Edit" ? "Edit User" : "View User"} </h2>
              <button onClick={() => setOpenModal(false)} className="" >  &times;  </button>
            </div>

            {/* Body */}

            <div className="scroll">
              <form action="">
                <div className="d-flex justify-content-between align-items-center">

                  <div>
                    <div className="group_from">
                      <label className="block text-sm font-medium mb-2">
                        First name
                      </label>
                      <div className="input_wrap">
                        <input type="text" name="first_name" value={formdata.first_name}
                          onChange={handleChange} placeholder="Enter first_name"
                          className="" />
                      </div>
                    </div>

                    <div className="group_from">
                      <label className="block text-sm font-medium mb-2">
                        Last name
                      </label>
                      <div className="input_wrap">
                        <input type="text" name="last_name" value={formdata.last_name}
                          onChange={handleChange} placeholder="Enter last_name"
                          className="" />
                      </div>
                    </div>
                    <div className="group_from">
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <div className="input_wrap">
                        <input type="email" name="email" value={formdata.email}
                          onChange={handleChange} placeholder="Enter email"
                          className="" />
                      </div>
                    </div>
                    <div className="group_from">
                      <label className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <div className="input_wrap">
                        <input type="tel" name="phone" value={formdata.phone}
                          onChange={handleChange} placeholder="Enter phone"
                          className="" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="group_from">
                      <label className="block text-sm font-medium mb-2">
                        Password
                      </label>
                      <div className="input_wrap">
                        <input type="password" name="password" value={formdata.password}
                          onChange={handleChange} placeholder="Enter password"
                          className="" />
                      </div>
                    </div>
                    <div className="group_from">
                      <label className="block text-sm font-medium mb-2">
                        Role
                      </label>
                      <div className="input_wrap">
                        <select name='role_name' value={formdata.role_name}
                          onChange={handleChange}>

                          <option value="">Select Role</option>
                          <option value="employee">Employee</option>
                          <option value="fleet_manager">Fleet Manager</option>
                          <option value="driver">Driver</option>
                        </select>
                      </div>
                    </div>

                    <div className="group_from">
                      <label className="block text-sm font-medium mb-2">
                        Status
                      </label>
                      <div className="input_wrap">
                        <select
                          name="status"
                          value={formdata.status}
                          onChange={handleChange}
                          className=""
                        >
                          <option value="">Select Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>

                      </div>
                    </div>
                  </div>
                </div>

                <div className="btn_part">
                  <button onClick={() => setOpenModal(false)} className=""  >
                    Cancel
                  </button>
                  <button className="" disabled={mode == 'view'} onClick={okButton}  >
                    {mode === "Add" ? "OK" : mode === "Edit" ? "Save" : "Close"}
                  </button>
                </div>


              </form>

            </div>
          </div>

        </div>


      )}
    </>
  );
} 