import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import ClassEducatorDashboard from "../pages/components/educator/ClassEducatorDashboard";
import ClassEducatorVideos from "../pages/components/educator/ClassEducatorVideos";
import ClassEducatorAttendance from "../pages/components/educator/ClassEducatorAttendance";
import ClassEducatorExams from "../pages/components/educator/ClassEducatorExams";
import { ROLES } from "../roles";

export default function EducatorClassRoutes() {
    return (
        <Routes>
            <Route
                element={<RoleProtectedRoute allowedRoles={[ROLES.EDUCATOR]} />}
            >
                <Route
                    path="teach/dashboard"
                    element={<ClassEducatorDashboard />}
                />
                <Route path="teach/videos" element={<ClassEducatorVideos />} />
                <Route
                    path="teach/attendance"
                    element={<ClassEducatorAttendance />}
                />
                <Route path="teach/exams" element={<ClassEducatorExams />} />
            </Route>
        </Routes>
    );
}
