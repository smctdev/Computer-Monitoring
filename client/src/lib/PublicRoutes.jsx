import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/loaders/Loading";

const PublicRoutes = ({ isAuthenticated, isLoading, children }) => {
  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return children ? children : <Outlet />;
};

export default PublicRoutes;
