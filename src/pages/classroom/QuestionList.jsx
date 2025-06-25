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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteQuestionAPI, getQuestionListAPI } from "../../api/question";
import QuestionTable from "../../components/question/QuestionTable";
import BackButton from "../../components/common/BackButton";

export default function QuestionList() {
    const { courseId, examId } = useParams();
    const navigate = useNavigate();

    const location = useLocation();
    const exam = location.state?.exam;
    const examStatus = exam?.status;

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getQuestionListAPI(courseId, examId);
                setQuestions(data);
                console.log(data);
            } catch (err) {
                console.log("시험 문제 조회 실패: " + err);
                setError("문제 목록을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [examId, courseId]);

    const handleDelete = async (questionId) => {
        if (!window.confirm("정말 이 문제를 삭제하시겠습니까?")) return;
        try {
            await deleteQuestionAPI(courseId, examId, questionId);
            setQuestions((prev) => prev.filter((q) => q.id !== questionId));
        } catch (err) {
            console.log("시험 문제 삭제 실패: " + err);
            alert("삭제에 실패했습니다.");
        }
    };

    // 문제 목록 중 비어있는 번호 찾기 (1부터 시작하는 자연수 중 비어 있는 가장 작은 수)
    const findNextAvailableNumber = (numbers) => {
        const numSet = new Set(numbers);
        let i = 1;
        while (numSet.has(i)) {
            i++;
        }
        return i;
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
                    <Box display="flex" gap={1} alignItems="center">
                        <BackButton
                            onClick={() =>
                                navigate(
                                    `/courses/${courseId}/classroom/teach/exams`
                                )
                            }
                        />
                        <Typography variant="h5">문제 목록</Typography>
                    </Box>
                    {examStatus === "PREPARING" && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                const existingNumbers = questions.map(
                                    (q) => q.number
                                );
                                const suggestedNumber =
                                    findNextAvailableNumber(existingNumbers);
                                navigate(`new`, {
                                    state: { exam, suggestedNumber },
                                });
                            }}
                        >
                            새 문제 추가
                        </Button>
                    )}
                </Box>

                {loading ? (
                    <Box textAlign="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <QuestionTable
                        questions={questions}
                        exam={exam}
                        examStatus={examStatus}
                        onDelete={handleDelete}
                        navigate={navigate}
                    />
                )}
            </Paper>
        </Container>
    );
}
