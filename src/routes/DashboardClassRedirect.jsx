import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/auth/useAuth";

const classRedirectMap = {
    EDUCATOR: "teach/dashboard",
    STUDENT: "learn/dashboard",
};

export default function DashboardClassRedirect() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { courseId } = useParams();

    useEffect(() => {
        if (!user || !courseId) return;

        const isInClassroom = location.pathname.includes("/classroom");
        if (!isInClassroom) return;

        const target = classRedirectMap[user.role];
        if (target) {
            // /courses/123/classroom/teach/dashboard 등으로 이동
            navigate(`${target}`, { replace: true });
        }
    }, [user, courseId, location, navigate]);

    return null;
}
