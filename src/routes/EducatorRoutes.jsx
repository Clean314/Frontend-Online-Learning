import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import CourseTeach from "../pages/components/educator/CourseTeach";
import { ROLES } from "../roles";
import MainDashboard from "../pages/main/MainDashboard";
import EduCourseRegister from "../pages/main/EduCourseRegister";
import CurriculumForm from "../pages/common/CurriculumForm";

export default function EducatorRoutes() {
    return (
        <Routes>
            <Route
                element={<RoleProtectedRoute allowedRoles={[ROLES.EDUCATOR]} />}
            >
                <Route path="dashboard" element={<MainDashboard />} />

                <Route path="courses/my" element={<CourseTeach />} />

                <Route path="courses/new" element={<EduCourseRegister />} />
                <Route
                    path="courses/new/:courseId/curriculum"
                    element={<CurriculumForm />}
                />
            </Route>
        </Routes>
    );
}
