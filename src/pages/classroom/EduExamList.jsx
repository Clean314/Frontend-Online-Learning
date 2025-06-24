import { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { deleteExamAPI, getExamListAPI } from "../../api/exam";
import { getQuestionListAPI } from "../../api/question";
import EduExamTable from "../../components/exam/EduExamTable";

export default function EduExamList() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 시험 목록 조회
    useEffect(() => {
        const fetchExams = async () => {
            setLoading(true);

            try {
                const data = await getExamListAPI(courseId);
                const sortedData = data.sort(
                    (a, b) => new Date(a.start_time) - new Date(b.start_time)
                );

                const examsWithStats = await Promise.all(
                    sortedData.map(async (exam) => {
                        try {
                            const questions = await getQuestionListAPI(
                                Number(courseId),
                                exam.id
                            );
                            return {
                                ...exam,
                                questionCount: questions.length,
                                totalScore: questions.reduce(
                                    (sum, q) => sum + (q.score || 0),
                                    0
                                ),
                            };
                        } catch (err) {
                            console.error(
                                `시험 ID ${exam.id}의 문제 목록 조회 실패`,
                                err
                            );
                            return {
                                ...exam,
                                questionCount: 0,
                                totalScore: 0,
                            };
                        }
                    })
                );

                setExams(examsWithStats);
            } catch (err) {
                let message = "시험 목록을 불러오는 중 오류가 발생했습니다.";
                if (err.response?.data?.detail) {
                    message = err.response.data.detail;
                }
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [courseId]);

    // 시험 삭제
    const handleDelete = async (examId) => {
        if (!window.confirm("정말 이 시험을 삭제하시겠습니까?")) return;

        try {
            await deleteExamAPI(Number(courseId), examId);
            setExams((prev) => prev.filter((e) => e.id !== examId));
        } catch (err) {
            console.error("시험 삭제 오류:" + err);
            alert("시험 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography variant="h5">시험 목록</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("new")}
                    >
                        새 시험 생성
                    </Button>
                </Box>

                {loading ? (
                    <Box textAlign="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <EduExamTable
                        exams={exams}
                        onDelete={handleDelete}
                        navigate={navigate}
                    />
                )}
            </Paper>
        </Container>
    );
}
