import React, { useState, useEffect, useRef } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    TextField,
    Radio,
    FormControlLabel,
    RadioGroup,
    CircularProgress,
    Snackbar,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

export default function TakeExamPage() {
    const { courseId, examId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [answers, setAnswers] = useState({});
    const [remainingTime, setRemainingTime] = useState(0);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const timerRef = useRef(null);

    const location = useLocation();
    const exam = location.state?.exam;

    useEffect(() => {
        // TODO: API 호출 구현 필요 (getQuestionListAPI)
        // 임시 데이터로 화면 렌더링 테스트
        const dummyData = {
            questions: [
                {
                    id: 201,
                    content: "React의 useState 훅은 무엇을 하는가?",
                    type: "MULTIPLE_CHOICE",
                    score: 5,
                    multipleChoices: [
                        "상태 관리",
                        "라우팅",
                        "스타일링",
                        "이벤트 처리",
                    ],
                },
                {
                    id: 203,
                    content:
                        "자바의 인터페이스는 다중 구현이 가능한가? 참/거짓으로 답하세요.",
                    type: "TRUE_FALSE",
                    score: 5,
                },
            ],
        };

        setTimeout(() => {
            setQuestions(dummyData.questions);

            const endTimeStr = exam?.endTime;
            const now = dayjs();
            const end = dayjs(endTimeStr);
            setRemainingTime(end.diff(now, "second"));
            setLoading(false);
        }, 500);
    }, [courseId, examId, exam]);

    // 남은 시간 카운트다운
    useEffect(() => {
        if (remainingTime <= 0) return;
        timerRef.current = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmit(true); // 시간이 다되면 자동 제출
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [remainingTime]);

    const formatTime = (sec) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;

        const hh = String(h).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        const ss = String(s).padStart(2, "0");

        return `${hh}시간 ${mm}분 ${ss}초`;
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (auto = false) => {
        const payload = {
            answers: questions.map((q) => ({
                questionId: q.id,
                response: answers[q.id] || "",
            })),
        };

        if (!auto) {
            // 자동 제출이 아닐 때, 미응답 문항이 있는지 확인
            const unanswered = questions.filter((q) => !answers[q.id]);
            if (unanswered.length > 0) {
                // 첫 번째 미응답 문항 번호를 알려주고 멈춤
                const firstIdx = questions.findIndex((q) => !answers[q.id]);
                alert(`문제 ${firstIdx + 1}에 대한 답변을 입력해주세요.`);
                return;
            }

            // TODO: API 호출 구현 필요 (submitExamAPI)
            console.log("제출 데이터:", payload);

            setSnackbarMsg("응시가 정상적으로 제출되었습니다.");
            setTimeout(
                () =>
                    navigate(
                        `/courses/${courseId}/classroom/learn/exams/${examId}/result`,
                        { state: { totalScore: exam.totalScore } }
                    ),
                1500
            );
        } else {
            navigate(
                `/courses/${courseId}/classroom/learn/exams/${examId}/result`,
                { state: { totalScore: exam.totalScore } }
            );
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
        <Container maxWidth="md" sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <Typography variant="h5">시험 응시</Typography>
                    <Typography
                        variant="h6"
                        color={remainingTime <= 60 ? "error" : "text.primary"}
                    >
                        남은 시간: {formatTime(remainingTime)}
                    </Typography>
                </Box>

                {questions.map((q, idx) => (
                    <Box key={q.id} mb={4}>
                        <Typography variant="subtitle1" mb={1}>
                            {`문제 ${idx + 1} (배점 ${q.score}점)`}
                        </Typography>
                        <Typography variant="body1" mb={2}>
                            {q.content}
                        </Typography>

                        {q.type === "MULTIPLE_CHOICE" && (
                            <RadioGroup
                                value={answers[q.id] || ""}
                                onChange={(e) =>
                                    handleAnswerChange(q.id, e.target.value)
                                }
                            >
                                {q.multipleChoices.map((choice, i) => (
                                    <FormControlLabel
                                        key={i}
                                        value={choice}
                                        control={<Radio />}
                                        label={choice}
                                    />
                                ))}
                            </RadioGroup>
                        )}

                        {q.type === "TRUE_FALSE" && (
                            <RadioGroup
                                value={answers[q.id] || ""}
                                onChange={(e) =>
                                    handleAnswerChange(q.id, e.target.value)
                                }
                            >
                                <FormControlLabel
                                    value="TRUE"
                                    control={<Radio />}
                                    label="참"
                                />
                                <FormControlLabel
                                    value="FALSE"
                                    control={<Radio />}
                                    label="거짓"
                                />
                            </RadioGroup>
                        )}
                    </Box>
                ))}

                <Box display="flex" justifyContent="center" mt={3}>
                    <Button
                        variant="contained"
                        size="large"
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
                // 화면 가로 정중앙
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                // 스타일 오버라이드: Snackbar 루트(top 위치)를 50%로 올린 다음, translateY로 정확히 중앙으로
                sx={{
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
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
