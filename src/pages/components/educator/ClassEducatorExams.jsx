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
    useTheme, // Chip 컴포넌트 임포트
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
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
        // TODO: API 호출 구현 필요 (getExamListAPI)
        // 임시 데이터로 화면 렌더링 테스트
        const dummyExams = [
            {
                id: 1,
                title: "중간고사",
                description: "중간고사 시험.",
                startTime: "2025-06-10T10:00:00",
                endTime: "2025-06-10T11:00:00",
                status: "COMPLETED",
                questionCount: 10,
            },
            {
                id: 2,
                title: "기말고사",
                description: "기말고사 시험입니다.",
                startTime: "2025-07-15T14:00:00",
                endTime: "2025-07-15T16:00:00",
                status: "PREPARED",
                questionCount: 20,
            },
        ];
        setTimeout(() => {
            setExams(dummyExams);
            setLoading(false);
        }, 500);
    }, [courseId]);

    const handleDelete = async (examId) => {
        if (!window.confirm("정말 이 시험을 삭제하시겠습니까?")) return;
        // TODO: API 호출 구현 필요 (deleteExamAPI)
        setExams((prev) => prev.filter((e) => e.id !== examId));
    };

    // 상태에 따라 Chip 색상을 매핑하는 헬퍼 함수
    const getStatusChipProps = (status) => {
        switch (status) {
            case "준비중":
                return { label: "준비중", color: "warning" };
            case "진행중":
                return { label: "진행중", color: "info" };
            case "종료":
                return { label: "종료", color: "success" };
            default:
                return { label: status, color: "default" };
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
                        onClick={() => navigate(`new`)}
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
                                <col style={{ width: "8%" }} />
                                <col style={{ width: "13%" }} />
                                <col style={{ width: "12%" }} />
                                <col style={{ width: "12%" }} />
                                <col style={{ width: "8%" }} />
                                <col style={{ width: "7%" }} />
                                <col style={{ width: "15%" }} />
                            </colgroup>
                            <TableHead>
                                <TableRow>
                                    <TableCell>제목</TableCell>
                                    <TableCell>설명</TableCell>
                                    <TableCell>시작</TableCell>
                                    <TableCell>종료</TableCell>
                                    <TableCell>상태</TableCell>
                                    <TableCell align="center">문제수</TableCell>
                                    <TableCell align="center">작업</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {exams.map((exam) => (
                                    <TableRow key={exam.id}>
                                        {/* 시험 제목 */}
                                        <TableCell>{exam.title}</TableCell>
                                        {/* 시험 설명 */}
                                        <TableCell>
                                            {exam.description}
                                        </TableCell>
                                        {/* 시험 시작 시각 */}
                                        <TableCell>
                                            {new Date(
                                                exam.startTime
                                            ).toLocaleString()}
                                        </TableCell>
                                        {/* 시험 종료 시각 */}
                                        <TableCell>
                                            {new Date(
                                                exam.endTime
                                            ).toLocaleString()}
                                        </TableCell>
                                        {/* 시험 상태을 Chip으로 표시 */}
                                        <TableCell>
                                            <Chip
                                                label={
                                                    exam.status === "PREPARED"
                                                        ? "준비중"
                                                        : "종료"
                                                }
                                                size="medium"
                                                sx={{
                                                    bgcolor:
                                                        exam.status ===
                                                        "PREPARED"
                                                            ? "#BFECFF"
                                                            : "#F8D7DA",
                                                    color:
                                                        exam.status ===
                                                        "PREPARED"
                                                            ? "#005F8A"
                                                            : "#721C24",
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </TableCell>
                                        {/* 시험 문제수 */}
                                        <TableCell align="center">
                                            {exam.questionCount}
                                        </TableCell>
                                        {/* 시험 관련 작업 버튼 */}
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
                                            {exam.status === "PREPARED" ? (
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
                                            ) : (
                                                <Tooltip title="전체 학생 성적 조회">
                                                    <IconButton
                                                        onClick={() =>
                                                            navigate(
                                                                `${exam.id}/scores`
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
                                        <TableCell colSpan={7} align="center">
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
