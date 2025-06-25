import { useState, useEffect, useRef } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    CircularProgress,
    Snackbar,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
    getSavedExamAnswersAPI,
    saveExamDraftAPI,
    submitStudentExamAPI,
} from "../../api/exam";
import { getStudentQuestionListAPI } from "../../api/question";
import ExamHeader from "../../components/exam_take/ExamHeader";
import QuestionItem from "../../components/exam_take/QuestionItem";

export default function TakeExam() {
    const { courseId, examId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const exam = location.state?.exam;

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [answers, setAnswers] = useState({});
    const [remainingTime, setRemainingTime] = useState(0);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const timerRef = useRef(null);
    const draftTimerRef = useRef(null);

    // 초기 데이터 로드 : 문제 목록 & 타이머 & 5분마다 임시 저장
    useEffect(() => {
        const load = async () => {
            try {
                // 문제 목록 조회
                const res = await getStudentQuestionListAPI(
                    Number(courseId),
                    Number(examId)
                );
                setQuestions(res);

                // 임시 저장 답안 불러오기
                try {
                    const saved = await getSavedExamAnswersAPI(
                        Number(courseId),
                        Number(examId)
                    );
                    if (saved && Object.keys(saved).length > 0) {
                        setAnswers(saved);
                    }
                } catch (err) {
                    console.warn("임시 저장 답안 불러오기 실패:", err);
                }

                // 남은 시간 계산
                const now = dayjs();
                const end = dayjs(exam.endTime);
                setRemainingTime(end.diff(now, "second"));

                // 5분마다 자동 임시 저장 예약
                draftTimerRef.current = setInterval(
                    async () => {
                        try {
                            await saveExamDraftAPI(
                                Number(courseId),
                                Number(examId),
                                answers
                            );
                            setSnackbarMsg("자동 임시 저장 완료");
                        } catch (err) {
                            console.error("자동 임시 저장 실패:", err);
                            setSnackbarMsg("자동 임시 저장 실패");
                        }
                    },
                    5 * 60 * 1000
                );
            } catch (err) {
                setError("시험 정보를 불러오는 중 오류가 발생했습니다.");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        load();
        return () => {
            clearInterval(timerRef.current);
            clearInterval(draftTimerRef.current);
        };
    }, [courseId, examId, exam]);

    // 남은 시간 카운트다운
    useEffect(() => {
        if (remainingTime <= 0) return;
        timerRef.current = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmit(true); // 자동 제출
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [remainingTime]);

    const handleAnswerChange = (questionId, selectedIndex) => {
        setAnswers((prev) => ({ ...prev, [questionId]: selectedIndex }));
    };

    // 임시 저장 (버튼 클릭)
    const handleAutoSave = async () => {
        try {
            await saveExamDraftAPI(Number(courseId), Number(examId), answers);
            setSnackbarMsg("임시 저장되었습니다.");
        } catch (err) {
            console.error("임시 저장 실패:", err);
            setSnackbarMsg("임시 저장 실패");
        }
    };

    // 최종 제출
    const handleSubmit = async (auto = false) => {
        clearInterval(draftTimerRef.current);

        if (!auto) {
            // 빈 응답 체크
            const unanswered = questions.filter((q) => !(q.id in answers));
            if (unanswered.length > 0) {
                const idx = questions.findIndex((q) => !(q.id in answers));
                alert(`문제 ${idx + 1}에 대한 답을 선택해주세요.`);
                return;
            }

            // 제출 전 확인
            const confirmed = window.confirm(
                "시험을 제출하시겠습니까? 시험을 제출한 후에는 재응시 할 수 없습니다."
            );
            if (!confirmed) return;

            try {
                await submitStudentExamAPI(
                    Number(courseId),
                    Number(examId),
                    answers
                );
                setSnackbarMsg("응시가 정상적으로 제출되었습니다.");
            } catch (err) {
                alert("시험 제출 중 오류가 발생했습니다.");
                console.log(err);
            }

            setTimeout(() => {
                navigate(`/courses/${courseId}/classroom/learn/exams`);
            }, 1500);
        } else {
            navigate(`/courses/${courseId}/classroom/learn/exams`);
        }
    };

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                <CircularProgress />
            </Box>
        );
    }
    if (error) {
        return (
            <Box textAlign="center" py={10}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <ExamHeader
                    title={exam.title}
                    remainingTime={remainingTime}
                    onBack={() =>
                        navigate(`/courses/${courseId}/classroom/teach/exams`)
                    }
                />

                {questions.map((q, idx) => (
                    <QuestionItem
                        key={q.id}
                        index={idx}
                        question={q}
                        answer={answers[q.id]}
                        onAnswerChange={handleAnswerChange}
                    />
                ))}

                <Box display="flex" justifyContent="center" mt={3}>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={handleAutoSave}
                    >
                        임시 저장
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{ ml: 2 }}
                        onClick={() => handleSubmit(false)}
                    >
                        응시 완료
                    </Button>
                </Box>
            </Paper>

            <Snackbar
                open={Boolean(snackbarMsg)}
                message={snackbarMsg}
                autoHideDuration={2000}
                onClose={() => setSnackbarMsg("")}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                sx={{ top: "50%", transform: "translateY(-50%)" }}
                slotProps={{
                    content: {
                        sx: {
                            bgcolor: "rgba(0, 0, 0, 0.8)",
                            color: "#fff",
                            px: 2,
                        },
                    },
                }}
            />
        </Container>
    );
}
