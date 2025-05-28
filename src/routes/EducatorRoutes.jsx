import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import DashboardHome from "../pages/components/DashboardHome";
import CourseRegister from "../pages/components/educator/CourseRegister";
import CourseTeach from "../pages/components/educator/CourseTeach";
import CourseEdit from "../pages/components/educator/CourseEdit";
import CurriculumRegister from "../pages/components/educator/CurriculumRegister";
import CurriculumEdit from "../pages/components/educator/CurriculumEdit";
import ClassEducatorDashboard from "../pages/components/educator/ClassEducatorDashboard";
import ClassEducatorVideos from "../pages/components/educator/ClassEducatorVideos";
import ClassEducatorAttendance from "../pages/components/educator/ClassEducatorAttendance";
import ClassEducatorExams from "../pages/components/educator/ClassEducatorExams";
import { ROLES } from "../roles";

export default function EducatorRoutes() {
    return (
        <Routes>
            <Route
                element={<RoleProtectedRoute allowedRoles={[ROLES.EDUCATOR]} />}
            >
                <Route path="dashboard" element={<DashboardHome />} />

                <Route path="courses/my" element={<CourseTeach />} />

                <Route path="courses/new" element={<CourseRegister />} />
                <Route
                    path="courses/new/:courseId/curriculum"
                    element={<CurriculumRegister />}
                />

                <Route path="courses/:courseId/edit" element={<CourseEdit />} />
                <Route
                    path="courses/:courseId/edit/curriculum"
                    element={<CurriculumEdit />}
                />
            </Route>
        </Routes>
    );
}
