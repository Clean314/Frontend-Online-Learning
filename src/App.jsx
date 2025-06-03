import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";

// 지연 로딩을 위한 컴포넌트 정의
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignUpPage = lazy(() => import("./pages/auth/SignUpPage"));
const RoleSelectPage = lazy(() => import("./pages/auth/RoleSelectPage"));
const NotAuthorizedPage = lazy(() => import("./pages/NotAuthorizedPage"));
const ClassPage = lazy(() => import("./pages/ClassPage"));
const MainPage = lazy(() => import("./pages/MainPage"));
const DashboardClassRedirect = lazy(
    () => import("./routes/DashboardClassRedirect")
);
const DashboardHomeRedirect = lazy(
    () => import("./routes/DashboardHomeRedirect")
);

const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));
const CourseRoutes = lazy(() => import("./routes/CourseRoutes"));
const EducatorRoutes = lazy(() => import("./routes/EducatorRoutes"));
const EducatorClassRoutes = lazy(() => import("./routes/EducatorClassRoutes"));
const StudentRoutes = lazy(() => import("./routes/StudentRoutes"));
const StudentClassRoutes = lazy(() => import("./routes/StudentClassRoutes"));

// 로딩 컴포넌트
const LoadingSpinner = () => (
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
        }}
    >
        Loading...
    </div>
);

function App() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<RoleSelectPage />} />
                <Route path="/signup/:role" element={<SignUpPage />} />
                <Route path="/not-authorized" element={<NotAuthorizedPage />} />

                <Route element={<ProtectedRoute />}>
                    {/* 메인 페이지 라우트 */}
                    <Route path="/" element={<MainPage />}>
                        <Route index element={<DashboardHomeRedirect />} />
                        <Route path="admin/*" element={<AdminRoutes />} />
                        <Route path="teach/*" element={<EducatorRoutes />} />
                        <Route path="learn/*" element={<StudentRoutes />} />
                        <Route path="courses/*" element={<CourseRoutes />} />
                    </Route>

                    {/* 강의실 페이지 라우트 */}
                    <Route
                        path="courses/:courseId/classroom/*"
                        element={<ClassPage />}
                    >
                        <Route index element={<DashboardClassRedirect />} />
                        <Route
                            path="teach/*"
                            element={<EducatorClassRoutes />}
                        />
                        <Route
                            path="learn/*"
                            element={<StudentClassRoutes />}
                        />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;
