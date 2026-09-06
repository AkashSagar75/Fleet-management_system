import React, { useState } from "react";
import CommonTable from '../../commonComponents/CommonTable'
import { CreateUser } from '../../Api/Transport/transport.js'
import { useSelector } from "react-redux";
import notificationService from "../../Common/notificationService.js";

const userColumns = [
  {
    key: "first_name",
    label: "User",
    render: (row) => `${row.first_name || ""} ${row.last_name || ""}`.trim() || "-",
  },
  {
    key: "email",
    label: "Email",
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
    key: "created_at",
    label: "Created On",
  },
];
export default function User() {
  const [loading, setLoading] = useState(false);

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
  console.log("Open Add User Modal");
};
  return (
    <div>
   <h1>User Managements</h1>

      <CommonTable
  columns={userColumns}
  data={users}
  loading={loading}
  actions={[
    {
      key: "edit",
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
  );
} 