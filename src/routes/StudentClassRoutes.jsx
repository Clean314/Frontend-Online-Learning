import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import { ROLES } from "../roles";
import TakeExamPage from "../pages/components/student/TakeExamPage";
import StuClassDashboard from "../pages/classroom/StuClassDashboard";
import StuExamList from "../pages/classroom/StuExamList";
import StuLectureVideoList from "../pages/classroom/StuLectureVideoList";
import LectureVideoWatch from "../pages/classroom/LectureVideoWatch";

export default function ClassroomRoutes() {
    return (
        <Routes>
            <Route
                element={<RoleProtectedRoute allowedRoles={[ROLES.STUDENT]} />}
            >
                <Route path="dashboard" element={<StuClassDashboard />} />
                <Route path="videos" element={<StuLectureVideoList />} />
                <Route path="videos/:videoId" element={<LectureVideoWatch />} />
                <Route path="exams" element={<StuExamList />} />
                <Route path="exams/:examId/take" element={<TakeExamPage />} />
            </Route>
        </Routes>
    );
}
