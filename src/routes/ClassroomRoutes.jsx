import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import ClassEducatorDashboard from "../pages/components/educator/ClassEducatorDashboard";
import ClassEducatorVideos from "../pages/components/educator/ClassEducatorVideos";
import ClassEducatorAttendance from "../pages/components/educator/ClassEducatorAttendance";
import ClassEducatorExams from "../pages/components/educator/ClassEducatorExams";
import ClassStudentDashboard from "../pages/components/student/ClassStudentDashboard";
import { ROLES } from "../roles";
import DashboardRedirect from "./DashboardRedirect";

export default function ClassroomRoutes() {
    return (
        <Routes>
            <Route index element={<DashboardRedirect />} />

            {/* 강사 전용 */}
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

            {/* 학생 전용 */}
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
