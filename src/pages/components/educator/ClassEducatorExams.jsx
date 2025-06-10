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
    Publish as PublishIcon,
    ListAlt as QuestionIcon,
    BarChart as BarChartIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

export default function ClassEducatorExams() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // TODO: getExamListAPI 호출 구현
        const dummyExams = [
            {
                id: 1,
                title: "중간고사",
                description: "중간고사 시험.",
                startTime: "2025-06-10T10:00:00",
                endTime: "2025-06-10T11:00:00",
                status: "COMPLETED",
                questionCount: 10,
                totalScore: 50, // 총점 (100 이하)
            },
            {
                id: 2,
                title: "기말고사",
                description: "기말고사 시험입니다.",
                startTime: "2025-07-15T14:00:00",
                endTime: "2025-07-15T16:00:00",
                status: "PREPARED",
                questionCount: 20,
                totalScore: 100,
            },
            {
                id: 3,
                title: "추가 시험",
                description: "현재 진행중인 시험입니다.",
                startTime: "2025-08-01T09:00:00",
                endTime: "2025-08-01T10:00:00",
                status: "IN_PROGRESS",
                questionCount: 15,
                totalScore: 80,
            },
            {
                id: 4,
                title: "심화 시험",
                description: "진행중이며 이미 응시자가 있는 시험입니다.",
                startTime: "2025-09-05T13:00:00",
                endTime: "2025-09-05T15:00:00",
                status: "IN_PROGRESS",
                questionCount: 25,
                totalScore: 90,
            },
        ];
        setTimeout(() => {
            setExams(dummyExams);
            setLoading(false);
        }, 500);
    }, [courseId]);

    const handleDelete = async (examId) => {
        if (!window.confirm("정말 이 시험을 삭제하시겠습니까?")) return;
        // TODO: deleteExamAPI 호출 구현
        setExams((prev) => prev.filter((e) => e.id !== examId));
    };

    const getStatusChipProps = (status) => {
        switch (status) {
            case "PREPARED":
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

    const handlePublish = async (examId) => {
        if (window.confirm("시험을 게시하시겠습니까?")) {
            // TODO: 상태 변경 API 호출
            setExams((prev) =>
                prev.map((e) =>
                    e.id === examId ? { ...e, status: "IN_PROGRESS" } : e
                )
            );
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
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "13%" }} />
                                <col style={{ width: "12%" }} />
                                <col style={{ width: "12%" }} />
                                <col style={{ width: "7%" }} />
                                <col style={{ width: "8%" }} />
                                <col style={{ width: "8%" }} />
                                <col style={{ width: "12%" }} />
                            </colgroup>
                            <TableHead>
                                <TableRow>
                                    <TableCell>제목</TableCell>
                                    <TableCell>설명</TableCell>
                                    <TableCell>시작</TableCell>
                                    <TableCell>종료</TableCell>
                                    <TableCell>상태</TableCell>
                                    <TableCell align="center">문제수</TableCell>
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
                                                exam.startTime
                                            ).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                exam.endTime
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
                                            {exam.status === "PREPARED" && (
                                                <>
                                                    <Tooltip title="게시">
                                                        <IconButton
                                                            color="success"
                                                            onClick={() =>
                                                                handlePublish(
                                                                    exam.id
                                                                )
                                                            }
                                                        >
                                                            <PublishIcon />
                                                        </IconButton>
                                                    </Tooltip>
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
