import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import ClassEducatorDashboard from "../pages/components/educator/ClassEducatorDashboard";
import ClassEducatorVideos from "../pages/components/educator/ClassEducatorVideos";
import ClassEducatorAttendance from "../pages/components/educator/ClassEducatorAttendance";
import ClassEducatorExams from "../pages/components/educator/ClassEducatorExams";
import { ROLES } from "../roles";
import CurriculumForm from "../pages/common/CurriculumForm";

export default function EducatorClassRoutes() {
    return (
        <Routes>
            <Route
                element={<RoleProtectedRoute allowedRoles={[ROLES.EDUCATOR]} />}
            >
                <Route path="dashboard" element={<ClassEducatorDashboard />} />
                <Route path="videos" element={<ClassEducatorVideos />} />
                <Route path="videos/edit" element={<CurriculumForm />} />
                <Route
                    path="attendance"
                    element={<ClassEducatorAttendance />}
                />
                <Route path="exams" element={<ClassEducatorExams />} />
            </Route>
        </Routes>
    );
}
