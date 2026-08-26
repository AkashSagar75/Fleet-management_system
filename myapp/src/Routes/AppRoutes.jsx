import { BrowserRouter as Router,  Routes,  Route, } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from "../Components/ErrorBoundary";
import ProtectedRoute from "./ProtectedRoute";
import Loading from "../Components/Loading";

 const Login = lazy(()=> import('../Layout/Login'));
const Forgetpassword = lazy(()=> import('../Layout/Forgetpassword'));
// const Dashboard = lazy(() => import("../Layout/Dashboard") );
import Dashboard from "../Layout/Dashboard";
const Onboarding = lazy(() => import("../Modules/SuperAdmin/Company/Onboarding") );
const CompanyList = lazy(() => import("../Modules/SuperAdmin/Company/CompanyList") );
import HomeDashboard  from "../Layout/HomeDahboard";
const Vehicle = lazy(() =>  import("../Modules/Transport/Vehicle") );
const VehicleType = lazy(() => import("../Modules/Transport/VehicleType") );
const PermissionPage = lazy(() => import("../pages/Permission/PermissionPage") );
const User = lazy(() => import("../pages/User/User") );

export default function AppRoutes() {  
  return (
    <ErrorBoundary>
      <suspense fallback={<Loading />}
      > 
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgetpassword" element={<Forgetpassword />} />
        <Route path="/dashboard/:role_id/:company_type_id/*" element={ 
          <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>}>
          {/* Super Admin Routes */}
          <Route path="companies" element={<Onboarding />} />
          <Route path="user" element={<User />} />
          <Route index element={<HomeDashboard />} />
          <Route path="dashboard" element={<HomeDashboard />} />
          <Route path="permissions" element={<PermissionPage />} />
          <Route  path="master/vehicles" element ={<Vehicle/>}/>
          <Route  path="vehicle-types" element ={<VehicleType/>}/>
        </Route>
      </Routes>
    </Router>
    </suspense>
    </ErrorBoundary >

  );
}