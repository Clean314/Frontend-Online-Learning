import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import AdminDashboard from "../pages/components/admin/AdminDashboard";
import AdminUserList from "../pages/components/admin/AdminUserList";
import AdminCourseList from "../pages/components/admin/AdminCourseList";
import { ROLES } from "../roles";

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
