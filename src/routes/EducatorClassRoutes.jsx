import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import { ROLES } from "../roles";
import CurriculumForm from "../pages/common/CurriculumForm";
import EduClassDashboard from "../pages/classroom/EduClassDashboard";
import EduExamList from "../pages/classroom/EduExamList";
import EduLectureVideoList from "../pages/classroom/EduLectureVideoList";
import AttendanceList from "../pages/classroom/AttendanceList";
import ExamForm from "../pages/classroom/ExamForm";
import ExamScoreList from "../pages/classroom/ExamScoreList";
import IndividualExamResult from "../pages/classroom/IndividualExamResult";
import QuestionList from "../pages/classroom/QuestionList";
import QuestionForm from "../pages/classroom/QuestionForm";
import QuestionDetail from "../pages/classroom/QuestionDetail";

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
                    element={<ExamScoreList />}
                />
                <Route
                    path="exams/:examId/scores/:studentId"
                    element={<IndividualExamResult />}
                />
                <Route
                    path="exams/:examId/questions"
                    element={<QuestionList />}
                />
                <Route
                    path="exams/:examId/questions/new"
                    element={<QuestionForm />}
                />
                <Route
                    path="exams/:examId/questions/:questionId/edit"
                    element={<QuestionForm />}
                />
                <Route
                    path="exams/:examId/questions/:questionId/detail"
                    element={<QuestionDetail />}
                />
            </Route>
        </Routes>
    );
}
