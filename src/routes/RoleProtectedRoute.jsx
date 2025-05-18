import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../auth/useAuth";

export default function RoleProtectedRoute({ allowedRoles, children }) {
    const { user } = useAuth();
    const location = useLocation();

    // 로그인 안되어 있으면 /login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 접근 허용된 role이 아니면 /not-authorized
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/not-authorized" replace />;
    }

    // 접근 허용된 role은 자식 컴포넌트 렌더링
    return children;
}
