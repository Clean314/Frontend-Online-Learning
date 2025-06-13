import React, { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Radio,
    RadioGroup,
    FormControlLabel,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";

export default function MyExamResultPage() {
    const { courseId, examId, studentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    // const { totalScore } = location.state || {};
    const totalScore = 15;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [results, setResults] = useState([]);

    // 뒤로가기 로직
    const handleBack = () => {
        const path = location.pathname;
        if (path.includes("/learn/")) {
            navigate(`/courses/${courseId}/classroom/learn/exams`);
        } else if (path.includes("/teach/")) {
            navigate(
                `/courses/${courseId}/classroom/teach/exams/${examId}/scores`
            );
        } else {
            navigate(-1);
        }
    };

    // 임시 질문 데이터
    const dummyQuestions = {
        1001: { 1: "상태 관리", 2: "렌더링 최적화", 3: "DOM 조작" },
        1002: { 1: "String", 2: "int", 3: "예외 처리" },
        1007: {
            1: "성공(200)",
            2: "클라이언트 오류(404)",
            3: "서버 오류(500)",
        },
    };

    useEffect(() => {
        // TODO: API 호출 구현 필요 (getExamResultsAPI 등)

        // 임시 데이터 활용
        const dummyResults = [
            {
                userId: 501,
                username: "김철수",
                score: 5,
                submittedAt: "2025-06-10T11:05:00",
                detail: [
                    {
                        question_id: 1001,
                        content: "React의 useState 훅은 무엇을 하는가?",
                        type: "MULTIPLE_CHOICE",
                        score: 5,
                        response: 1,
                        answer: 1,
                        isCorrect: true,
                    },
                    {
                        question_id: 1002,
                        content: "다음 중 Java의 기본 자료형이 아닌 것은?",
                        type: "MULTIPLE_CHOICE",
                        score: 5,
                        response: 3,
                        answer: 1,
                        isCorrect: false,
                    },
                    {
                        question_id: 1003,
                        content: "HTML 문서의 루트 요소는 <html> 이다.",
                        type: "TRUE_FALSE",
                        score: 5,
                        response: 0,
                        answer: 1,
                        isCorrect: false,
                    },
                    // ... 기타 문항
                ],
            },
            // ... 다른 사용자 결과
        ];
        setTimeout(() => {
            setResults(dummyResults);
            setLoading(false);
        }, 500);
    }, [courseId, examId, studentId]);

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

    // TODO: 실제 로그인된 사용자 ID로 대체
    const currentUserId = 501;
    // const targetUserId = studentId ? Number(studentId) : currentUserId;
    const targetUserId = currentUserId;
    const myResult = results.find((r) => r.userId === targetUserId);

    if (!myResult) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography>응시 기록이 없습니다.</Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box display="flex" gap={1} alignItems="center" mb={2}>
                    <BackButton onClick={handleBack} />
                    <Typography variant="h5">
                        {studentId
                            ? `${myResult.username}님의 성적`
                            : "내 시험 결과"}
                    </Typography>
                    <Typography variant="subtitle1">
                        : {myResult.score}점 &nbsp;/&nbsp; {totalScore ?? 0}점
                    </Typography>
                </Box>

                {myResult.detail.map((item, idx) => {
                    const isMultiple = item.type === "MULTIPLE_CHOICE";
                    const choices = isMultiple
                        ? dummyQuestions[item.question_id] || {}
                        : { 1: "참", 0: "거짓" };
                    const selected = String(item.response);

                    return (
                        <Paper
                            key={idx}
                            sx={() => ({
                                p: 2,
                                mb: 2,
                                bgcolor: item.isCorrect ? "#E8F9FF" : "#FFEDF3",
                            })}
                        >
                            <Typography variant="subtitle2" gutterBottom>
                                {`문제 ${idx + 1} (${
                                    isMultiple ? "선다형" : "진위형"
                                } / 배점 ${item.score}점)`}
                            </Typography>
                            <Typography variant="body2" mb={1}>
                                {item.content}
                            </Typography>
                            <RadioGroup>
                                {Object.entries(choices).map(([key, label]) => {
                                    const isUserChoice = key === selected;
                                    const isCorrectChoice =
                                        !item.isCorrect &&
                                        key === String(item.answer);
                                    return (
                                        <FormControlLabel
                                            key={key}
                                            value={key}
                                            control={
                                                <Radio
                                                    slotProps={{
                                                        input: {
                                                            readOnly: true,
                                                        },
                                                    }}
                                                    checked={isUserChoice}
                                                />
                                            }
                                            label={`${label}${isCorrectChoice ? " (정답)" : ""}`}
                                            slotProps={{
                                                label: {
                                                    sx: {
                                                        fontWeight:
                                                            isCorrectChoice
                                                                ? "bold"
                                                                : "normal",
                                                    },
                                                },
                                            }}
                                        />
                                    );
                                })}
                            </RadioGroup>
                            <Typography
                                variant="body2"
                                color={item.isCorrect ? "#4DA8DA" : "error"}
                            >
                                {item.isCorrect ? "정답입니다." : "틀렸습니다."}
                            </Typography>
                        </Paper>
                    );
                })}
            </Paper>
        </Container>
    );
}
