import React, { useState, useEffect, useRef } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Radio,
    FormControlLabel,
    RadioGroup,
    CircularProgress,
    Snackbar,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
    getStudentExamDetailAPI,
    submitStudentExamAPI,
} from "../../../api/exam";

export default function TakeExamPage() {
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
                const res = await getStudentExamDetailAPI(
                    Number(courseId),
                    Number(examId)
                );
                setQuestions(res.questions);

                // 남은 시간 계산
                const now = dayjs();
                const end = dayjs(exam.endTime);
                setRemainingTime(end.diff(now, "second"));

                // 5분마다 자동 임시 저장 예약
                draftTimerRef.current = setInterval(
                    () => {
                        // TODO: saveExamDraftAPI 호출
                        // await saveExamDraftAPI(Number(courseId), Number(examId), { answers: ... });
                        setSnackbarMsg("임시 저장 (테스트용 알림)");
                    },
                    5 * 60 * 1000
                );
            } catch (err) {
                setError("시험 정보를 불러오는 중 오류가 발생했습니다.");
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

    const formatTime = (sec) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${String(h).padStart(2, "0")}시간 ${String(m).padStart(2, "0")}분 ${String(s).padStart(2, "0")}초`;
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    // 임시 저장 (버튼 클릭)
    const handleAutoSave = async () => {
        // TODO: saveExamDraftAPI 호출
        setSnackbarMsg("임시 저장되었습니다.");
    };

    // 최종 제출
    const handleSubmit = async (auto = false) => {
        clearInterval(draftTimerRef.current);

        if (!auto) {
            // 빈 응답 체크
            const unanswered = questions.filter((q) => !answers[q.id]);
            if (unanswered.length > 0) {
                const idx = questions.findIndex((q) => !answers[q.id]);
                alert(`문제 ${idx + 1}에 대한 답변을 입력해주세요.`);
                return;
            }

            try {
                await submitStudentExamAPI(
                    Number(courseId),
                    Number(examId),
                    answers
                );
                setSnackbarMsg("응시가 정상적으로 제출되었습니다.");
            } catch (err) {
                alert("시험 제출 중 오류가 발생했습니다.");
            }

            setTimeout(() => {
                navigate(
                    `/courses/${courseId}/classroom/learn/exams/${examId}/result`,
                    { state: { totalScore: exam.totalScore } }
                );
            }, 1500);
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

                        {q.type === "MULTIPLE_CHOICE" ? (
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
                        ) : (
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
