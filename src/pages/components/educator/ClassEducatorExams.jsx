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
    ListAlt as QuestionIcon,
    BarChart as BarChartIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { deleteExamAPI, getExamListAPI } from "../../../api/exam";

export default function ClassEducatorExams() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 시험 목록 조회
    useEffect(() => {
        setLoading(true);

        getExamListAPI(courseId)
            .then((data) => {
                // questions 배열을 이용해 문제 수 & 총점 계산 => API로 백앤드에서 계산해서 받아오도록 수정
                const examsWithStats = data.map((exam) => ({
                    ...exam,
                    questionCount: Array.isArray(exam.questions)
                        ? exam.questions.length
                        : 0,
                    totalScore: Array.isArray(exam.questions)
                        ? exam.questions.reduce(
                              (sum, q) => sum + (q.score || 0),
                              0
                          )
                        : 0,
                }));
                setExams(examsWithStats);
                setLoading(false);

                console.log(exams);
            })
            .catch((err) => {
                let message = "시험 목록을 불러오는 중 오류가 발생했습니다.";
                if (err.response?.data?.detail) {
                    message = err.response.data.detail;
                }
                setError(message);
                setLoading(false);
            });
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

    // Chip 스타일링
    const getStatusChipProps = (status) => {
        switch (status) {
            case "PREPARING":
                return {
                    label: "준비중",
                    sx: {
                        bgcolor: "#BFECFF",
                        color: "#005F8A",
                        fontWeight: 500,
                    },
                };
            case "IN_PROGRESS":
                return {
                    label: "진행중",
                    sx: {
                        bgcolor: "#D6EFD8",
                        color: "#155724",
                        fontWeight: 500,
                    },
                };
            case "COMPLETED":
                return {
                    label: "종료",
                    sx: {
                        bgcolor: "#F8D7DA",
                        color: "#721C24",
                        fontWeight: 500,
                    },
                };
            default:
                return { label: status, sx: {} };
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
                    <TableContainer>
                        <Table>
                            <colgroup>
                                <col style={{ width: "14%" }} />
                                <col style={{ width: "14%" }} />
                                <col style={{ width: "13%" }} />
                                <col style={{ width: "13%" }} />
                                <col style={{ width: "7%" }} />
                                <col style={{ width: "9%" }} />
                                <col style={{ width: "8%" }} />
                                <col style={{ width: "14%" }} />
                            </colgroup>
                            <TableHead>
                                <TableRow>
                                    <TableCell>제목</TableCell>
                                    <TableCell>설명</TableCell>
                                    <TableCell>시작</TableCell>
                                    <TableCell>종료</TableCell>
                                    <TableCell>상태</TableCell>
                                    <TableCell align="center">
                                        문제 수
                                    </TableCell>
                                    <TableCell align="center">총점</TableCell>
                                    <TableCell align="center">작업</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {exams.map((exam) => (
                                    <TableRow key={exam.id}>
                                        <TableCell>{exam.title}</TableCell>
                                        <TableCell>
                                            {exam.description}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                exam.start_time
                                            ).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                exam.end_time
                                            ).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                {...getStatusChipProps(
                                                    exam.status
                                                )}
                                                size="medium"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {exam.questionCount}
                                        </TableCell>
                                        <TableCell align="center">
                                            {exam.totalScore}점
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="문제 관리">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        navigate(
                                                            `${exam.id}/questions`,
                                                            { state: { exam } }
                                                        )
                                                    }
                                                >
                                                    <QuestionIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {exam.status === "PREPARING" && (
                                                <>
                                                    <Tooltip title="수정">
                                                        <IconButton
                                                            color="info"
                                                            onClick={() =>
                                                                navigate(
                                                                    `${exam.id}/edit`,
                                                                    {
                                                                        state: {
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
                                                                    exam.id
                                                                )
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                            {(exam.status === "IN_PROGRESS" ||
                                                exam.status ===
                                                    "COMPLETED") && (
                                                <Tooltip title="전체 응시자 성적 조회">
                                                    <IconButton
                                                        onClick={() =>
                                                            navigate(
                                                                `${exam.id}/scores`,
                                                                {
                                                                    state: {
                                                                        totalScore:
                                                                            exam.totalScore,
                                                                    },
                                                                }
                                                            )
                                                        }
                                                    >
                                                        <BarChartIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {exams.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            등록된 시험이 없습니다.
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
