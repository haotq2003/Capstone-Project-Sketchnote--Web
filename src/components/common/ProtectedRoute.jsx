import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const location = useLocation();
    const accessToken = localStorage.getItem("accessToken");
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");

    if (!accessToken) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has at least one of the allowed roles
    const hasPermission =
        allowedRoles.length === 0 ||
        allowedRoles.some((role) => roles.includes(role));

    if (!hasPermission) {
        // Redirect to 404 or unauthorized page if user doesn't have permission
        return <Navigate to="/not-found" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
