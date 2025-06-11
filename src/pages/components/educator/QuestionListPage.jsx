import React, { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    CircularProgress,
    Tooltip,
    Chip,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function QuestionListPage() {
    const { courseId, examId } = useParams();
    const navigate = useNavigate();

    const location = useLocation();
    // 상위에서 넘겨준 exam 정보 꺼내기
    const exam = location.state?.exam;
    const examStatus = exam?.status;

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // TODO: API 호출 구현 필요 (getQuestionListAPI)
        // 임시 데이터로 화면 렌더링 테스트
        const dummyQuestions = [
            {
                id: 101,
                content: "자바스크립트의 원시 타입은 무엇인가요?",
                type: "MULTIPLE_CHOICE",
                score: 5,
                multipleChoices: ["String", "Number", "Boolean", "Symbol"],
                answerIndex: 2, // 1-based로 저장하면 2=> 사용자에게는 2로 보임
            },
            {
                id: 103,
                content: "JPA는 ORM인가요?",
                type: "TRUE_FALSE",
                score: 5,
                answerIndex: 0, // 0 => "거짓"
            },
        ];
        setTimeout(() => {
            setQuestions(dummyQuestions);
            setLoading(false);
        }, 500);
    }, [courseId, examId]);

    const handleDelete = async (questionId) => {
        if (!window.confirm("정말 이 문제를 삭제하시겠습니까?")) return;
        // TODO: API 호출 구현 필요 (deleteQuestionAPI)
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    };

    // 문제 유형별 Chip 속성 반환
    const getTypeChipProps = (type) => {
        switch (type) {
            case "MULTIPLE_CHOICE":
                return {
                    label: "선다형",
                    sx: {
                        bgcolor: "#BFECFF",
                        color: "#005F8A",
                        fontWeight: 500,
                    },
                };
            case "TRUE_FALSE":
                return {
                    label: "진위형",
                    sx: {
                        bgcolor: "#FFF6E3",
                        color: "#7A6000",
                        fontWeight: 500,
                    },
                };
            default:
                return { label: type, sx: {} };
        }
    };

    // 답 표시 로직
    const getAnswerDisplay = (question) => {
        if (question.type === "MULTIPLE_CHOICE") {
            // answerIndex가 1부터 시작하는 자연수로 저장되어 있다고 가정
            return question.answerIndex != null
                ? String(question.answerIndex)
                : "-";
        }
        if (question.type === "TRUE_FALSE") {
            if (question.answerIndex === 0) return "거짓";
            if (question.answerIndex === 1) return "참";
            return "-";
        }
        return "-";
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
                        {/* 뒤로 가기 버튼 */}
                        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5">문제 목록</Typography>
                    </Box>
                    {examStatus === "PREPARED" && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate(`new`)}
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
                    <TableContainer>
                        <Table>
                            <colgroup>
                                <col style={{ width: "5%" }} />
                                <col style={{ width: "20%" }} />
                                <col style={{ width: "7%" }} />
                                <col style={{ width: "7%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "12%" }} />
                            </colgroup>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>문제 내용</TableCell>
                                    <TableCell align="center">유형</TableCell>
                                    <TableCell align="center">배점</TableCell>
                                    <TableCell align="center">
                                        선택지 수
                                    </TableCell>
                                    <TableCell align="center">정답</TableCell>
                                    <TableCell align="center">작업</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {questions.map((question) => (
                                    <TableRow key={question.id}>
                                        {/* 문제 ID */}
                                        <TableCell>{question.id}</TableCell>
                                        {/* 문제 내용 */}
                                        <TableCell>
                                            {question.content}
                                        </TableCell>
                                        {/* 문제 유형 (한국어) */}
                                        <TableCell align="center">
                                            <Chip
                                                {...getTypeChipProps(
                                                    question.type
                                                )}
                                                size="medium"
                                            />
                                        </TableCell>
                                        {/* 배점 */}
                                        <TableCell align="center">
                                            {question.score}
                                        </TableCell>
                                        {/* 선택지 수 (선다형만 해당) */}
                                        <TableCell align="center">
                                            {question.type === "MULTIPLE_CHOICE"
                                                ? question.multipleChoices
                                                      .length
                                                : "-"}
                                        </TableCell>
                                        {/* 답 표시 */}
                                        <TableCell align="center">
                                            {getAnswerDisplay(question)}
                                        </TableCell>
                                        {/* 작업 버튼 */}
                                        <TableCell align="center">
                                            {examStatus !== "PREPARED" ? (
                                                // "PREPARED" 가 아닌 상태일 때는 수정/삭제 대신 "자세히" 버튼
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() =>
                                                        navigate(
                                                            `${question.id}/detail`,
                                                            {
                                                                state: {
                                                                    question,
                                                                    exam,
                                                                },
                                                            }
                                                        )
                                                    }
                                                >
                                                    자세히
                                                </Button>
                                            ) : (
                                                <>
                                                    <Tooltip title="수정">
                                                        <IconButton
                                                            color="info"
                                                            onClick={() =>
                                                                navigate(
                                                                    `${question.id}/edit`,
                                                                    {
                                                                        state: {
                                                                            question,
                                                                        },
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="삭제">
                                                        <IconButton
                                                            color="error"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    question.id
                                                                )
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {questions.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            등록된 문제가 없습니다.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Container>
    );
}
