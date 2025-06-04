import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import CourseRegister from "../pages/components/educator/CourseRegister";
import CourseTeach from "../pages/components/educator/CourseTeach";
import CurriculumRegister from "../pages/components/educator/CurriculumRegister";
import { ROLES } from "../roles";
import MainDashboard from "../pages/main/MainDashboard";

export default function EducatorRoutes() {
    return (
        <Routes>
            <Route
                element={<RoleProtectedRoute allowedRoles={[ROLES.EDUCATOR]} />}
            >
                <Route path="dashboard" element={<MainDashboard />} />

                <Route path="courses/my" element={<CourseTeach />} />

                <Route path="courses/new" element={<CourseRegister />} />
                <Route
                    path="courses/new/:courseId/curriculum"
                    element={<CurriculumRegister />}
                />
            </Route>
        </Routes>
    );
}
