import { Navigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (user === null) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
