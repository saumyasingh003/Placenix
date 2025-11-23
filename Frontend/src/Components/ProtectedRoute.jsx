import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";

/**
 * ProtectedRoute component for role-based access control
 * @param {Object} props
 * @param {string} props.allowedRole - The role allowed to access this route ("Student" or "Admin")
 * @param {React.ReactNode} props.children - Optional children to render
 */
const ProtectedRoute = ({ allowedRole, children }) => {
  const currentUser = localStorage.getItem("currentUser");
  
  // Check if user is authenticated
  if (!currentUser) {
    toast.error("Please login to access this page");
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(currentUser);
    
    // Check if user has the correct role
    if (user.role !== allowedRole) {
      toast.error(`Access denied. This page is only for ${allowedRole} users.`);
      
      // Redirect based on user's actual role
      if (user.role === "admin") {
        return <Navigate to="/admin" replace />;
      } else if (user.role === "student") {
        return <Navigate to="/home" replace />;
      } else {
        // Unknown role, redirect to login
        toast.error("Invalid user role. Please login again.");
        return <Navigate to="/login" replace />;
      }
    }

    // User has correct role, render the protected content
    return children || <Outlet />;
  } catch (error) {
    console.error("Error parsing user data:", error);
    toast.error("Invalid user data. Please login again.");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

