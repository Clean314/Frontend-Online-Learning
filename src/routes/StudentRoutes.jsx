import { Routes, Route, Navigate } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import { ROLES } from "../roles";
import MainDashboard from "../pages/main/MainDashboard";
import StuCourseMy from "../pages/main/StuCourseMy";

export default function StudentRoutes() {
    return (
        <Routes>
            <Route
                element={<RoleProtectedRoute allowedRoles={[ROLES.STUDENT]} />}
            >
                <Route path="dashboard" element={<MainDashboard />} />

                <Route path="courses/my">
                    <Route index element={<Navigate to="total" replace />} />
                    <Route path=":enrolledStatus" element={<StuCourseMy />} />
                </Route>
            </Route>
        </Routes>
    );
}
