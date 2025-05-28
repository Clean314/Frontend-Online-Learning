import { Routes, Route, Navigate } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import DashboardHome from "../pages/components/DashboardHome";
import CourseEnrolled from "../pages/components/student/CourseEnrolled";
import { ROLES } from "../roles";

export default function StudentRoutes() {
    return (
        <Routes>
            <Route
                element={<RoleProtectedRoute allowedRoles={[ROLES.STUDENT]} />}
            >
                <Route path="dashboard" element={<DashboardHome />} />

                <Route path="courses/my">
                    <Route index element={<Navigate to="total" replace />} />
                    <Route
                        path=":enrolledStatus"
                        element={<CourseEnrolled />}
                    />
                </Route>
            </Route>
        </Routes>
    );
}
