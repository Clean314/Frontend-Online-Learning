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
import { deleteQuestionAPI, getQuestionListAPI } from "../../../api/question";

export default function QuestionListPage() {
    const { courseId, examId } = useParams();
    const navigate = useNavigate();

    const location = useLocation();
    // ClassEducatorExams에서 전달된 exam 데이터
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
                        <IconButton
                            onClick={() =>
                                navigate(
                                    `/courses/${courseId}/classroom/teach/exams`
                                )
                            }
                            sx={{ mr: 1 }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5">문제 목록</Typography>
                    </Box>
                    {examStatus === "PREPARING" && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate(`new`, { state: { exam } })}
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
                                    <TableCell></TableCell>
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
                                {questions.map((question, idx) => (
                                    <TableRow key={question.id}>
                                        {/* 문제 인덱싱 */}
                                        <TableCell>{idx + 1}</TableCell>
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
                                            {examStatus !== "PREPARING" ? (
                                                // "PREPARING" 가 아닌 상태일 때는 수정/삭제 대신 "자세히" 버튼
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
                                                                            exam,
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
