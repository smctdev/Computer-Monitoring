import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/loaders/Loading";

const RequiredChangePasswordRoutes = ({
  isAuthenticated,
  isLoading,
  isRequiredChangePassword,
  children,
}) => {
  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated && !isRequiredChangePassword) {
    return <Navigate to="/dashboard" />;
  }

  if (!isAuthenticated && !isRequiredChangePassword) {
    return <Navigate to="/login" />;
  }

  return children ? children : <Outlet />;
};

export default RequiredChangePasswordRoutes;
