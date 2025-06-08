import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import CourseDetail from "../pages/main/CourseDetail";
import { ROLES } from "../roles";
import TotalCourseList from "../pages/main/TotalCourseList";

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
                <Route index element={<TotalCourseList />} />
                <Route path=":courseId" element={<CourseDetail />} />
            </Route>
        </Routes>
    );
}
