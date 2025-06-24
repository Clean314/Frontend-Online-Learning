import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import QuestionListPage from "../pages/components/educator/QuestionListPage";
import { ROLES } from "../roles";
import CurriculumForm from "../pages/common/CurriculumForm";
import QuestionFormPage from "../pages/components/educator/QuestionFormPage";
import AllStudentScoresPage from "../pages/components/educator/AllStudentScoresPage";
import QuestionDetailPage from "../pages/components/educator/QuestionDetailPage";
import MyExamResultPage from "../pages/components/educator/MyExamResultPage";
import EduClassDashboard from "../pages/classroom/EduClassDashboard";
import EduExamList from "../pages/classroom/EduExamList";
import EduLectureVideoList from "../pages/classroom/EduLectureVideoList";
import AttendanceList from "../pages/classroom/AttendanceList";
import ExamForm from "../pages/classroom/ExamForm";

export default function EducatorClassRoutes() {
    return (
        <Routes>
            <Route
                element={<RoleProtectedRoute allowedRoles={[ROLES.EDUCATOR]} />}
            >
                <Route path="dashboard" element={<EduClassDashboard />} />
                <Route path="videos" element={<EduLectureVideoList />} />
                <Route path="videos/edit" element={<CurriculumForm />} />
                <Route path="attendance" element={<AttendanceList />} />
                <Route path="exams" element={<EduExamList />} />
                <Route path="exams/new" element={<ExamForm />} />
                <Route path="exams/:examId/edit" element={<ExamForm />} />
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
