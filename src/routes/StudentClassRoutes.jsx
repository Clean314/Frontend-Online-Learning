import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import ClassStudentDashboard from "../pages/components/student/ClassStudentDashboard";
import ClassStudentVideos from "../pages/components/student/ClassStudentVideos";
import ClassStudentVideosWatch from "../pages/components/student/ClassStudentVideosWatch";
import { ROLES } from "../roles";
import ClassStudentExams from "../pages/components/student/ClassStudentExams";

export default function ClassroomRoutes() {
    return (
        <Routes>
            <Route
                element={<RoleProtectedRoute allowedRoles={[ROLES.STUDENT]} />}
            >
                <Route path="dashboard" element={<ClassStudentDashboard />} />
                <Route path="videos" element={<ClassStudentVideos />} />
                <Route
                    path="videos/:videoId"
                    element={<ClassStudentVideosWatch />}
                />
                <Route path="exams" element={<ClassStudentExams />} />
            </Route>
        </Routes>
    );
}
