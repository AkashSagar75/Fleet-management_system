 import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import TopNavbar from "./TopNavbar";
import { Outlet, useParams } from "react-router-dom";

export default function Dashboard() {
  const { role_id, company_type_id } = useParams();
 
  
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen  overflow-hidden gap-3 pl-4">

      {/* SIDEBAR */}
      <Sidebar
        selectedRoleId={role_id}
        selectedCompanyTypeId={company_type_id}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden gap-2 ">

        {/* TOPBAR */}
        <TopNavbar collapsed={collapsed} />

        {/* PAGE */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 mt-5">
            <Outlet />
        </main>

      </div>
    </div>
  );
}