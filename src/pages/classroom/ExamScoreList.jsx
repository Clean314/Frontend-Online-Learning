import { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getStudentExamSubmissionsAPI } from "../../api/exam";
import { getCourseInfoAPI } from "../../api/course";
import BackButton from "../../components/common/BackButton";
import ExamSummaryHeader from "../../components/exam_score/ExamSummaryHeader";
import StudentScoreTable from "../../components/exam_score/StudentScoreTable";

export default function ExamScoreList() {
    const { courseId, examId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { totalScore } = location.state || {};

    const [scores, setScores] = useState([]);
    const [totalStudents, setTotalStudents] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const submittedScores = scores.filter((s) => s.submitted);
    const averageScore =
        submittedScores.length > 0
            ? (
                  submittedScores.reduce(
                      (sum, item) => sum + item.totalScore,
                      0
                  ) / submittedScores.length
              ).toFixed(1)
            : 0;

    useEffect(() => {
        const loadScoresAndStudents = async () => {
            try {
                const [submissions, courseInfo] = await Promise.all([
                    getStudentExamSubmissionsAPI(
                        Number(courseId),
                        Number(examId)
                    ),
                    getCourseInfoAPI(Number(courseId)),
                ]);

                setScores(submissions);
                const total =
                    courseInfo.max_enrollment - courseInfo.available_enrollment;
                setTotalStudents(total);
            } catch (err) {
                console.error("성적 또는 수강자 수 조회 실패:", err);
                setError("성적 정보를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        if (courseId && examId) {
            loadScoresAndStudents();
        }
    }, [courseId, examId]);

    const handleBack = () => {
        navigate(`/courses/${courseId}/classroom/teach/exams`);
    };

    const handleViewDetail = (studentId, studentData) => {
        navigate(`${studentId}`, {
            state: {
                totalScore,
                student: studentData,
            },
        });
    };

    return (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <BackButton onClick={handleBack} />
                    <Typography variant="h5">전체 학생 성적 조회</Typography>
                </Box>

                {loading ? (
                    <Box textAlign="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <>
                        <ExamSummaryHeader
                            totalStudents={totalStudents}
                            submittedCount={submittedScores.length}
                            averageScore={averageScore}
                            totalScore={totalScore}
                        />
                        <StudentScoreTable
                            scores={scores}
                            onViewDetail={handleViewDetail}
                        />
                    </>
                )}
            </Paper>
        </Container>
    );
}
