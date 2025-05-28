import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/auth/useAuth";

const DashboardRedirect = () => {
    const { user } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user) return;

        const isInClassroom = location.pathname.includes("/classroom");

        const roleRedirectMap = {
            ADMIN: "admin/dashboard",
            EDUCATOR: "teach/dashboard",
            STUDENT: "learn/dashboard",
        };

        const target = roleRedirectMap[user.role];

        if (isInClassroom) {
            // 상대 경로 리디렉션
            navigate(target, { replace: true });
        } else {
            // 절대 경로 리디렉션
            navigate(`/${target}`, { replace: true });
        }
    }, [user, location, navigate]);

    return null;
};

export default DashboardRedirect;
