import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import ClassStudentVideos from "../pages/components/student/ClassStudentVideos";
import ClassStudentVideosWatch from "../pages/components/student/ClassStudentVideosWatch";
import { ROLES } from "../roles";
import TakeExamPage from "../pages/components/student/TakeExamPage";
import StuClassDashboard from "../pages/classroom/StuClassDashboard";
import StuExamList from "../pages/classroom/StuExamList";

export default function ClassroomRoutes() {
    return (
        <Routes>
            <Route
                element={<RoleProtectedRoute allowedRoles={[ROLES.STUDENT]} />}
            >
                <Route path="dashboard" element={<StuClassDashboard />} />
                <Route path="videos" element={<ClassStudentVideos />} />
                <Route
                    path="videos/:videoId"
                    element={<ClassStudentVideosWatch />}
                />
                <Route path="exams" element={<StuExamList />} />
                <Route path="exams/:examId/take" element={<TakeExamPage />} />
            </Route>
        </Routes>
    );
}
