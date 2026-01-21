import "./styles/Tailwind.css";
import LogIn from "./Request/Login";
import { Routes, Route } from "react-router-dom";
import Forgot from "./Request/Forgot";
import SignUp from "./Request/Signup";
import DashBoard from "./Dashboard/Dashboard";
import Unit from "./Dashboard/Setup/Unit";
import Set from "./Dashboard/Setup/Set";
import Profile from "./Dashboard/Profile";
import Computers from "./Dashboard/Computers";
import QrC from "./Dashboard/Qrcodes";
import Extract from "./Dashboard/Extract";
import Reset from "./Request/Reset";
import User from "./Dashboard/Setup/User";
import Add from "./Dashboard/Setup/Add";
import TransferedUnits from "./Dashboard/transferedUnits";
import NotFound from "./components/Notfound";
import PrintInformation from "./Dashboard/PopupForComputers/Print";
import AllLogs from "./Dashboard/AllLogs";
import AllUnits from "./Dashboard/allUnits";
import Users from "./Dashboard/Setup/Users";
import Branches from "./Dashboard/Setup/Branches";
import NotAuthorized from "./components/NotAuthorized";
import BranchCode from "./pages/branch-code/BranchCode";
import Department from "./pages/department/Department";
import Supplier from "./pages/supplier/Supplier";
import Position from "./pages/position/Position";
import Category from "./pages/categories/Category";
import TransferedBranchUnits from "./Dashboard/transferedBranchUnits";
import { useAuth } from "./context/AuthContext";
import ProtectedRoutes from "./lib/ProtectedRoutes";
import PublicRoutes from "./lib/PublicRoutes";
import RequiredChangePasswordRoutes from "./lib/RequiredChangePasswordRoutes";

function App() {
  const { isAuthenticated, isRequiredChangePassword, loading, isAdmin } =
    useAuth();
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoutes
            isAuthenticated={isAuthenticated}
            isLoading={loading}
            isRequiredChangePassword={isRequiredChangePassword}
          />
        }
      >
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/unit" element={<Unit />} />
        <Route path="/set" element={<Set />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/branches" element={<BranchCode />} />
        <Route path="/departments" element={<Department />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/suppliers" element={<Supplier />} />
        <Route path="/positions" element={<Position />} />
        <Route path="/computers" element={<Computers />} />
        <Route path="/qr" element={<QrC />} />
        <Route path="/transfered-units" element={<TransferedUnits />} />
        <Route
          path="/transfered-branch-units"
          element={<TransferedBranchUnits />}
        />
        <Route path="/all-units" element={<AllUnits />} />
        <Route path="/user" element={<User />} />
        <Route path="/setup/branch-units" element={<Branches />} />
        <Route path="/all-logs" element={<AllLogs />} />
        <Route path="/add" element={<Add />} />
        <Route path="/print/:id" element={<PrintInformation />} />
        <Route
          path="/admin/users-list"
          element={isAdmin ? <Users /> : <NotAuthorized />}
        />
      </Route>

      <Route
        element={
          <RequiredChangePasswordRoutes
            isAuthenticated={isAuthenticated}
            isLoading={loading}
            isRequiredChangePassword={isRequiredChangePassword}
          />
        }
      >
        <Route path="/change-new-password" element={<Reset />} />
      </Route>

      <Route
        element={
          <PublicRoutes isAuthenticated={isAuthenticated} isLoading={loading} />
        }
      >
        <Route path="/login" element={<LogIn />} />
        <Route path="/" element={<LogIn />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/computers/:id" element={<Extract />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
