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
import { useNavigate, useParams } from "react-router-dom";
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

    useEffect(() => {
        // TODO: API 호출 구현 필요 (getQuestionListAPI)
        // 임시 데이터로 화면 렌더링 테스트
        const dummyData = {
            endTime: "2025-06-10T11:00:00",
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
                    id: 202,
                    content: "CSS Flexbox의 주요 속성 중 하나를 설명하시오.",
                    type: "ESSAY",
                    score: 10,
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
            const now = dayjs();
            const end = dayjs(dummyData.endTime);
            setRemainingTime(end.diff(now, "second"));
            setLoading(false);
        }, 500);
    }, [courseId, examId]);

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
        const m = String(Math.floor(sec / 60)).padStart(2, "0");
        const s = String(sec % 60).padStart(2, "0");
        return `${m}:${s}`;
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
            // TODO: API 호출 구현 필요 (submitExamAPI)
            console.log("제출 데이터:", payload);
            setSnackbarMsg("응시가 정상적으로 제출되었습니다.");
            setTimeout(
                () => navigate(`/courses/${courseId}/exams/${examId}/results`),
                1500
            );
        } else {
            navigate(`/courses/${courseId}/exams/${examId}/results`);
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
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
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

                        {q.type === "ESSAY" && (
                            <TextField
                                multiline
                                rows={4}
                                placeholder="주관식 답안을 입력하세요."
                                value={answers[q.id] || ""}
                                onChange={(e) =>
                                    handleAnswerChange(q.id, e.target.value)
                                }
                                fullWidth
                            />
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
            />
        </Container>
    );
}
