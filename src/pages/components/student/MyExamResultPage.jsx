import React, { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";

export default function MyExamResultPage() {
    const { courseId, examId, studentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { totalScore } = location.state || {};

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
        // TODO: API 호출 구현 필요

        // 임시 데이터 활용
        const dummyResults = [
            {
                userId: 501,
                username: "김철수",
                score: 80,
                submittedAt: "2025-06-10T11:05:00",
                detail: [
                    {
                        question_id: 1001,
                        content: "React의 useState 훅은 무엇을 하는가?",
                        type: "MULTIPLE_CHOICE",
                        score: 5,
                        response: 1, // 선택지 번호
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
                        response: 0, // 0=거짓, 1=참
                        answer: 1,
                        isCorrect: false,
                    },
                    {
                        question_id: 1004,
                        content:
                            "CSS에서 margin 은 padding 보다 바깥 여백을 설정한다.",
                        type: "TRUE_FALSE",
                        score: 5,
                        response: 1,
                        answer: 1,
                        isCorrect: true,
                    },
                    {
                        question_id: 1005,
                        content:
                            "JavaScript의 Array.prototype.map 반환 타입은 원래 배열과 동일하다.",
                        type: "TRUE_FALSE",
                        score: 5,
                        response: 1,
                        answer: 1,
                        isCorrect: true,
                    },
                    {
                        question_id: 1006,
                        content:
                            "REST API 설계 시 GET 요청은 서버 상태를 변경할 수 있다.",
                        type: "TRUE_FALSE",
                        score: 5,
                        response: 0,
                        answer: 1,
                        isCorrect: false,
                    },
                    {
                        question_id: 1007,
                        content:
                            "HTTP 상태 코드 404 는 요청이 성공했음을 나타낸다.",
                        type: "MULTIPLE_CHOICE",
                        score: 5,
                        response: 2,
                        answer: 2,
                        isCorrect: true,
                    },
                ],
            },
            {
                userId: 502,
                username: "이영희",
                score: 88,
                submittedAt: "2025-06-10T11:02:00",
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
                        response: 1,
                        answer: 1,
                        isCorrect: true,
                    },
                    {
                        question_id: 1003,
                        content: "HTML 문서의 루트 요소는 <html> 이다.",
                        type: "TRUE_FALSE",
                        score: 5,
                        response: 1,
                        answer: 1,
                        isCorrect: true,
                    },
                    {
                        question_id: 1004,
                        content:
                            "CSS에서 margin 은 padding 보다 바깥 여백을 설정한다.",
                        type: "TRUE_FALSE",
                        score: 5,
                        response: 0,
                        answer: 1,
                        isCorrect: false,
                    },
                    {
                        question_id: 1005,
                        content:
                            "JavaScript의 Array.prototype.map 반환 타입은 원래 배열과 동일하다.",
                        type: "TRUE_FALSE",
                        score: 5,
                        response: 1,
                        answer: 1,
                        isCorrect: true,
                    },
                    {
                        question_id: 1006,
                        content:
                            "REST API 설계 시 GET 요청은 서버 상태를 변경할 수 있다.",
                        type: "TRUE_FALSE",
                        score: 5,
                        response: 1,
                        answer: 1,
                        isCorrect: true,
                    },
                    {
                        question_id: 1007,
                        content:
                            "HTTP 상태 코드 404 는 요청이 성공했음을 나타낸다.",
                        type: "MULTIPLE_CHOICE",
                        score: 5,
                        response: 1,
                        answer: 2,
                        isCorrect: false,
                    },
                ],
            },
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
    // URL에 studentId가 있으면 그걸 사용, 없으면 내 ID 사용
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

    const tfLabel = (val) => (val === 1 ? "참" : "거짓");

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
                        : {myResult.score}점 &nbsp;/&nbsp;
                        {totalScore ?? "-"}점
                    </Typography>
                </Box>

                {myResult.detail.map((item, idx) => {
                    const typeLabel =
                        item.type === "MULTIPLE_CHOICE"
                            ? "선다형"
                            : item.type === "TRUE_FALSE"
                              ? "진위형"
                              : "서술형";
                    let displayResponse = "";
                    let displayAnswer = "";

                    if (item.type === "TRUE_FALSE") {
                        displayResponse = tfLabel(item.response);
                        displayAnswer = tfLabel(item.answer);
                    } else if (item.type === "MULTIPLE_CHOICE") {
                        const choices = dummyQuestions[item.question_id] || {};
                        displayResponse = `${item.response}. ${choices[item.response] || ""}`;
                        displayAnswer = `${item.answer}. ${choices[item.answer] || ""}`;
                    }

                    return (
                        <Paper key={idx} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="subtitle2" mb={0.6}>
                                {`문제 ${idx + 1} (${typeLabel} / 배점 ${item.score}점)`}
                            </Typography>
                            <Typography variant="body2" mb={1}>
                                {item.content}
                            </Typography>
                            {(item.type === "MULTIPLE_CHOICE" ||
                                item.type === "TRUE_FALSE") && (
                                <Typography
                                    variant="body2"
                                    color={item.isCorrect ? "primary" : "error"}
                                >
                                    나의 답: {displayResponse} / 정답:{" "}
                                    {displayAnswer} (
                                    {item.isCorrect ? "정답" : "오답"})
                                </Typography>
                            )}
                        </Paper>
                    );
                })}
            </Paper>
        </Container>
    );
}
