import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Protects routes that require authentication
const AuthCheck = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default AuthCheck;
