import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import ClassStudentDashboard from "../pages/components/student/ClassStudentDashboard";
import ClassStudentVideos from "../pages/components/student/ClassStudentVideos";
import { ROLES } from "../roles";

export default function ClassroomRoutes() {
    return (
        <Routes>
            <Route
                element={<RoleProtectedRoute allowedRoles={[ROLES.STUDENT]} />}
            >
                <Route path="dashboard" element={<ClassStudentDashboard />} />
                <Route path="videos" element={<ClassStudentVideos />} />
            </Route>
        </Routes>
    );
}
