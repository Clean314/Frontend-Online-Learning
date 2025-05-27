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
import CourseList from "./pages/components/CourseList";
import CourseEnrolled from "./pages/components/student/CourseEnrolled";
import CourseDetail from "./pages/components/CourseDetail";
import AdminUserList from "./pages/components/admin/AdminUserList";
import AdminCourseList from "./pages/components/admin/AdminCourseList";
import DashboardRedirect from "./routes/DashboardRedirect";
import AdminDashboard from "./pages/components/admin/AdminDashboard";
import CourseEdit from "./pages/components/educator/CourseEdit";
import ClassPage from "./pages/ClassPage";
import ClassDashboardRedirect from "./routes/ClassDashboardRedirect";
import ClassStudentDashboard from "./pages/components/student/ClassStudentDashboard";
import CurriculumRegister from "./pages/components/educator/CurriculumRegister";
import CurriculumEdit from "./pages/components/educator/CurriculumEdit";
import ClassEducatorDashboard from "./pages/components/educator/ClassEducatorDashboard";
import ClassEducatorVideos from "./pages/components/educator/ClassEducatorVideos";
import ClassEducatorAttendance from "./pages/components/educator/ClassEducatorAttendance";
import ClassEducatorExams from "./pages/components/educator/ClassEducatorExams";

function App() {
    return (
        <>
            <Routes>
                {/* 공개 경로 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<RoleSelectPage />} />
                <Route path="/signup/:role" element={<SignUpPage />} />
                <Route path="/not-authorized" element={<NotAuthorizedPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<MainPage />}>
                        {/* 루트(“/”)로 들어오면 역할별 Redirect */}
                        <Route index element={<DashboardRedirect />} />

                        {/* 관리자 전용 */}
                        <Route
                            path="admin/dashboard"
                            element={
                                <RoleProtectedRoute allowedRoles={["ADMIN"]}>
                                    <AdminDashboard />
                                </RoleProtectedRoute>
                            }
                        />
                        <Route
                            path="admin/users"
                            element={
                                <RoleProtectedRoute allowedRoles={["ADMIN"]}>
                                    <AdminUserList />
                                </RoleProtectedRoute>
                            }
                        />
                        <Route
                            path="admin/courses"
                            element={
                                <RoleProtectedRoute allowedRoles={["ADMIN"]}>
                                    <AdminCourseList />
                                </RoleProtectedRoute>
                            }
                        />

                        {/* 학생 & 강사 공용 */}
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
                        <Route
                            path="courses"
                            element={
                                <RoleProtectedRoute
                                    allowedRoles={["EDUCATOR", "STUDENT"]}
                                >
                                    <CourseList />
                                </RoleProtectedRoute>
                            }
                        />
                        <Route
                            path="courses/:courseId"
                            element={
                                <RoleProtectedRoute
                                    allowedRoles={["EDUCATOR", "STUDENT"]}
                                >
                                    <CourseDetail />
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
                            path="teach/newCourse/:courseId/curriculum"
                            element={
                                <RoleProtectedRoute allowedRoles={["EDUCATOR"]}>
                                    <CurriculumRegister />
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
                        <Route
                            path="courses/:courseId/edit"
                            element={
                                <RoleProtectedRoute allowedRoles={["EDUCATOR"]}>
                                    <CourseEdit />
                                </RoleProtectedRoute>
                            }
                        />
                        <Route
                            path="courses/:courseId/edit/curriculum"
                            element={
                                <RoleProtectedRoute allowedRoles={["EDUCATOR"]}>
                                    <CurriculumEdit />
                                </RoleProtectedRoute>
                            }
                        />

                        {/* 학생 전용 */}
                        <Route path="learn/myCourses">
                            <Route
                                index
                                element={<Navigate to="total" replace />}
                            />
                            <Route
                                path=":enrolledStatus"
                                element={
                                    <RoleProtectedRoute
                                        allowedRoles={["STUDENT"]}
                                    >
                                        <CourseEnrolled />
                                    </RoleProtectedRoute>
                                }
                            />
                        </Route>
                    </Route>
                    {/* 강의실 */}
                    <Route
                        path="/courses/:courseId/classroom/*"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={["EDUCATOR", "STUDENT"]}
                            >
                                <ClassPage />
                            </RoleProtectedRoute>
                        }
                    >
                        <Route index element={<ClassDashboardRedirect />} />

                        {/* 강사 전용 */}
                        <Route
                            path="teach/dashboard"
                            element={
                                <RoleProtectedRoute allowedRoles={["EDUCATOR"]}>
                                    <ClassEducatorDashboard />
                                </RoleProtectedRoute>
                            }
                        />
                        <Route
                            path="teach/videos"
                            element={
                                <RoleProtectedRoute allowedRoles={["EDUCATOR"]}>
                                    <ClassEducatorVideos />
                                </RoleProtectedRoute>
                            }
                        />
                        <Route
                            path="teach/attendance"
                            element={
                                <RoleProtectedRoute allowedRoles={["EDUCATOR"]}>
                                    <ClassEducatorAttendance />
                                </RoleProtectedRoute>
                            }
                        />
                        <Route
                            path="teach/exams"
                            element={
                                <RoleProtectedRoute allowedRoles={["EDUCATOR"]}>
                                    <ClassEducatorExams />
                                </RoleProtectedRoute>
                            }
                        />

                        {/* 학생 전용 */}
                        <Route
                            path="learn/dashboard"
                            element={
                                <RoleProtectedRoute allowedRoles={["STUDENT"]}>
                                    <ClassStudentDashboard />
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
