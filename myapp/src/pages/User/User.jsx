import React, { useState } from "react";
import CommonTable from '../../commonComponents/CommonTable'
import '../../assets/CSS/CommonTable.css'

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

  const handleEdit = (row) => {
    console.log("Edit User:", row);
  };

  const handleDelete = (row) => {
    console.log("Delete User:", row);
  };

  const handlePageChange = (page) => {
    console.log("Page:", page);

    // yaha API call karega
    // getUsers(page)
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