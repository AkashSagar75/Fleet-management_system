import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "../Layout/Login";
import Forgetpassword from "../Layout/Forgetpassword";
import Sidebar from "../Components/Sidebar";
import Dashboard from "../Layout/Dashboard";

import { useUser } from "../Context/role";
// import Onboarding from "../Components/Onboarding";
import Onboarding from "../Modules/SuperAdmin/Company/Onboarding";
import CompanyList from "../Modules/SuperAdmin/Company/CompanyList";
// import CompanyList from "../Components/CompanyList";
import HomeDashboard from "../Components/HomeDahboard";
import TopNavbar from "../Layout/TopNavbar";

export default function AppRoutes() {

  const { authRole } = useUser();
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgetpassword" element={<Forgetpassword />} />
        <Route path="/dashboard/:role_id/:company_type_id/*" element={<Dashboard />}>
          <Route index element={<HomeDashboard />} />
          <Route path="dashboard" element={<HomeDashboard />} />
          <Route path="companies/onboarding" element={<Onboarding />} />
          <Route path="companies/list" element={<CompanyList />} />
        </Route>
      </Routes>
    </Router>
    </>
  );
}