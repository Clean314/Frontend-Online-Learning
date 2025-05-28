import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import CourseList from "../pages/components/CourseList";
import CourseDetail from "../pages/components/CourseDetail";
import { ROLES } from "../roles";

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
            </Route>
        </Routes>
    );
}
