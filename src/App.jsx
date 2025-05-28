import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import RoleSelectPage from "./pages/auth/RoleSelectPage";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";
import ClassPage from "./pages/ClassPage";
import MainPage from "./pages/MainPage";
import DashboardClassRedirect from "./routes/DashboardClassRedirect";
import DashboardHomeRedirect from "./routes/DashboardHomeRedirect";

import AdminRoutes from "./routes/AdminRoutes";
import CourseRoutes from "./routes/CourseRoutes";
import EducatorRoutes from "./routes/EducatorRoutes";
import EducatorClassRoutes from "./routes/EducatorClassRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import StudentClassRoutes from "./routes/StudentClassRoutes";

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
                    <Route index element={<DashboardHomeRedirect />} />
                    <Route path="admin/*" element={<AdminRoutes />} />
                    <Route path="teach/*" element={<EducatorRoutes />} />
                    <Route path="learn/*" element={<StudentRoutes />} />
                    <Route path="courses/*" element={<CourseRoutes />} />
                </Route>

                {/* ClassPage */}
                <Route
                    path="courses/:courseId/classroom/*"
                    element={<ClassPage />}
                >
                    <Route index element={<DashboardClassRedirect />} />
                    <Route path="teach/*" element={<EducatorClassRoutes />} />
                    <Route path="learn/*" element={<StudentClassRoutes />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
