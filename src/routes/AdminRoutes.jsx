import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import { ROLES } from "../roles";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUserList from "../pages/admin/AdminUserList";
import AdminCourseList from "../pages/admin/AdminCourseList";

const AdminRoutes = () => (
    <Routes>
        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUserList />} />
            <Route path="courses" element={<AdminCourseList />} />
        </Route>
    </Routes>
);

export default AdminRoutes;
