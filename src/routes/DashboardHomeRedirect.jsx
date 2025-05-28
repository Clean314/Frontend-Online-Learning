import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/auth/useAuth";

const roleRedirectMap = {
    ADMIN: "/admin/dashboard",
    EDUCATOR: "/teach/dashboard",
    STUDENT: "/learn/dashboard",
};

export default function DashboardHomeRedirect() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const target = roleRedirectMap[user.role];

        if (target) {
            navigate(target, { replace: true });
        }
    }, [user, navigate]);

    return null;
}
