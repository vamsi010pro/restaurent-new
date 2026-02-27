import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../services/AuthProvider';
import LsService from "../services/localstorage";

const ProtectedRoute = () => {
  const user = LsService.getItem("user");

  if (!user) {
    // If there is no authenticated user, redirect to login page
    return <Navigate to="/" />;
    // return <Navigate to="/QR-Restaurant-Menu/" />;
  }

  return <Outlet />;  // Render nested routes here
};

export default ProtectedRoute;
