import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import ClassEducatorDashboard from "../pages/components/educator/ClassEducatorDashboard";
import ClassEducatorVideos from "../pages/components/educator/ClassEducatorVideos";
import ClassEducatorAttendance from "../pages/components/educator/ClassEducatorAttendance";
import ClassEducatorExams from "../pages/components/educator/ClassEducatorExams";
import ExamFormPage from "../pages/components/educator/ExamFormPage";
import QuestionListPage from "../pages/components/educator/QuestionListPage";
import { ROLES } from "../roles";
import CurriculumForm from "../pages/common/CurriculumForm";
import QuestionFormPage from "../pages/components/educator/QuestionFormPage";
import AllStudentScoresPage from "../pages/components/educator/AllStudentScoresPage";
import QuestionDetailPage from "../pages/components/educator/QuestionDetailPage";

export default function EducatorClassRoutes() {
    return (
        <Routes>
            <Route
                element={<RoleProtectedRoute allowedRoles={[ROLES.EDUCATOR]} />}
            >
                <Route path="dashboard" element={<ClassEducatorDashboard />} />
                <Route path="videos" element={<ClassEducatorVideos />} />
                <Route path="videos/edit" element={<CurriculumForm />} />
                <Route
                    path="attendance"
                    element={<ClassEducatorAttendance />}
                />
                <Route path="exams" element={<ClassEducatorExams />} />
                <Route path="exams/new" element={<ExamFormPage />} />
                <Route path="exams/:examId/edit" element={<ExamFormPage />} />
                <Route
                    path="exams/:examId/scores"
                    element={<AllStudentScoresPage />}
                />
                <Route
                    path="exams/:examId/questions"
                    element={<QuestionListPage />}
                />
                <Route
                    path="exams/:examId/questions/new"
                    element={<QuestionFormPage />}
                />
                <Route
                    path="exams/:examId/questions/:questionId/edit"
                    element={<QuestionFormPage />}
                />
                <Route
                    path="exams/:examId/questions/:questionId/detail"
                    element={<QuestionDetailPage />}
                />
            </Route>
        </Routes>
    );
}
