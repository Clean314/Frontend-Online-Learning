import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import ClassEducatorVideos from "../pages/components/educator/ClassEducatorVideos";
import ExamFormPage from "../pages/components/educator/ExamFormPage";
import QuestionListPage from "../pages/components/educator/QuestionListPage";
import { ROLES } from "../roles";
import CurriculumForm from "../pages/common/CurriculumForm";
import QuestionFormPage from "../pages/components/educator/QuestionFormPage";
import AllStudentScoresPage from "../pages/components/educator/AllStudentScoresPage";
import QuestionDetailPage from "../pages/components/educator/QuestionDetailPage";
import ClassAttendancePage from "../pages/components/educator/ClassAttendancePage";
import ClassEducatorExams from "../pages/components/educator/ClassEducatorExams";
import MyExamResultPage from "../pages/components/educator/MyExamResultPage";
import EduClassDashboard from "../pages/classroom/EduClassDashboard";

export default function EducatorClassRoutes() {
    return (
        <Routes>
            <Route
                element={<RoleProtectedRoute allowedRoles={[ROLES.EDUCATOR]} />}
            >
                <Route path="dashboard" element={<EduClassDashboard />} />
                <Route path="videos" element={<ClassEducatorVideos />} />
                <Route path="videos/edit" element={<CurriculumForm />} />
                <Route path="attendance" element={<ClassAttendancePage />} />
                <Route path="exams" element={<ClassEducatorExams />} />
                <Route path="exams/new" element={<ExamFormPage />} />
                <Route path="exams/:examId/edit" element={<ExamFormPage />} />
                <Route
                    path="exams/:examId/scores"
                    element={<AllStudentScoresPage />}
                />
                <Route
                    path="exams/:examId/scores/:studentId"
                    element={<MyExamResultPage />}
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
