import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import RoleSelectPage from "./pages/auth/RoleSelectPage";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";
import MainPage from "./pages/MainPage";
import DashboardRedirect from "./routes/DashboardRedirect";

import AdminRoutes from "./routes/AdminRoutes";
import ClassroomRoutes from "./routes/ClassroomRoutes";
import CourseRoutes from "./routes/CourseRoutes";
import EducatorRoutes from "./routes/EducatorRoutes";
import StudentRoutes from "./routes/StudentRoutes";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RoleSelectPage />} />
            <Route path="/signup/:role" element={<SignUpPage />} />
            <Route path="/not-authorized" element={<NotAuthorizedPage />} />

            <Route element={<ProtectedRoute />}>
                {/* MainPage */}
                <Route path="/" element={<MainPage />}>
                    <Route index element={<DashboardRedirect />} />
                    <Route path="admin/*" element={<AdminRoutes />} />
                    <Route path="teach/*" element={<EducatorRoutes />} />
                    <Route path="learn/*" element={<StudentRoutes />} />
                    <Route path="courses/*" element={<CourseRoutes />} />
                </Route>

                {/* ClassPage */}
                <Route
                    path="courses/:courseId/classroom/*"
                    element={<ClassroomRoutes />}
                />
            </Route>
        </Routes>
    );
}

export default App;
