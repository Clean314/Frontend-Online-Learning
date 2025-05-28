import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import ClassStudentDashboard from "../pages/components/student/ClassStudentDashboard";
import { ROLES } from "../roles";

export default function ClassroomRoutes() {
    return (
        <Routes>
            <Route
                element={<RoleProtectedRoute allowedRoles={[ROLES.STUDENT]} />}
            >
                <Route
                    path="learn/dashboard"
                    element={<ClassStudentDashboard />}
                />
            </Route>
        </Routes>
    );
}
