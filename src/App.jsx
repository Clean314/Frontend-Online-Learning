import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import SignUpPage from "./pages/sign_up/SignUpPage";
import RoleSelectPage from "./pages/sign_up/RoleSelectPage";
import MainPage from "./pages/MainPage";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";
import DashboardHome from "./pages/components/DashboardHome";
import CourseRegister from "./pages/components/educator/CourseRegister";
import CourseTeach from "./pages/components/educator/CourseTeach";
import CourseList from "./pages/components/student/CourseList";
import CourseEnrolled from "./pages/components/student/CourseEnrolled";
import CourseDetail from "./pages/components/CourseDetail";

function App() {
    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<RoleSelectPage />} />
                <Route path="/signup/:role" element={<SignUpPage />} />
                <Route path="/not-authorized" element={<NotAuthorizedPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<MainPage />}>
                        <Route
                            index
                            element={<Navigate to="dashboard" replace />}
                        />
                        <Route
                            path="dashboard"
                            element={
                                <RoleProtectedRoute
                                    allowedRoles={["EDUCATOR", "STUDENT"]}
                                >
                                    <DashboardHome />
                                </RoleProtectedRoute>
                            }
                        />
                        {/* 강사 전용 */}
                        <Route
                            path="teach/newCourse"
                            element={
                                <RoleProtectedRoute allowedRoles={["EDUCATOR"]}>
                                    <CourseRegister />
                                </RoleProtectedRoute>
                            }
                        />
                        <Route
                            path="teach/myCourses"
                            element={
                                <RoleProtectedRoute allowedRoles={["EDUCATOR"]}>
                                    <CourseTeach />
                                </RoleProtectedRoute>
                            }
                        />
                        {/* 학생 전용 */}
                        <Route
                            path="learn/courses"
                            element={
                                <RoleProtectedRoute allowedRoles={["STUDENT"]}>
                                    <CourseList />
                                </RoleProtectedRoute>
                            }
                        />
                        <Route
                            path="learn/courses/:courseId"
                            element={
                                <RoleProtectedRoute allowedRoles={["STUDENT"]}>
                                    <CourseDetail />
                                </RoleProtectedRoute>
                            }
                        />
                        <Route
                            path="learn/myCourses/:enrolledStatus"
                            element={
                                <RoleProtectedRoute allowedRoles={["STUDENT"]}>
                                    <CourseEnrolled />
                                </RoleProtectedRoute>
                            }
                        />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
