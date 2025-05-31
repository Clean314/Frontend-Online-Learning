import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import CourseList from "../pages/components/CourseList";
import CourseDetail from "../pages/components/CourseDetail";
import { ROLES } from "../roles";
import CourseEdit from "../pages/components/educator/CourseEdit";
import CurriculumEdit from "../pages/components/educator/CurriculumEdit";

export default function CourseRoutes() {
    return (
        <Routes>
            <Route
                element={
                    <RoleProtectedRoute
                        allowedRoles={[ROLES.EDUCATOR, ROLES.STUDENT]}
                    />
                }
            >
                <Route index element={<CourseList />} />
                <Route path=":courseId" element={<CourseDetail />} />

                <Route
                    element={
                        <RoleProtectedRoute allowedRoles={[ROLES.EDUCATOR]} />
                    }
                >
                    <Route path=":courseId/edit" element={<CourseEdit />} />
                    <Route
                        path=":courseId/edit/curriculum"
                        element={<CurriculumEdit />}
                    />
                </Route>
            </Route>
        </Routes>
    );
}
