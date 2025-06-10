import { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
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
    PlayArrow as PlayArrowIcon,
    History as HistoryIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

export default function ClassStudentExams() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // TODO: API 호출 구현 필요 (getStudentExamListAPI)
        const dummyExams = [
            {
                id: 1,
                title: "중간고사",
                startTime: "2025-06-10T10:00:00",
                endTime: "2025-06-10T11:00:00",
                hasTaken: true,
                score: 85,
                totalScore: 100,
            },
            {
                id: 2,
                title: "기말고사",
                startTime: "2025-07-15T14:00:00",
                endTime: "2025-07-15T16:00:00",
                hasTaken: false,
                score: null,
                totalScore: 50,
            },
            // 테스트용 임시 데이터: 오늘 06-10 오전 8:30 ~ 오후 11:59
            {
                id: 3,
                title: "테스트 시험",
                startTime: "2025-06-10T08:30:00",
                endTime: "2025-06-10T23:59:00",
                hasTaken: false,
                score: null,
                totalScore: 100,
            },
        ];
        setTimeout(() => {
            setExams(dummyExams);
            setLoading(false);
        }, 500);
    }, [courseId]);

    const getStatusChipProps = (hasTaken) => {
        if (hasTaken) {
            return {
                label: "응시 완료",
                sx: {
                    bgcolor: "#F8D7DA",
                    color: "#721C24",
                    fontWeight: 500,
                },
            };
        } else {
            return {
                label: "미응시",
                sx: {
                    bgcolor: "#D6EFD8",
                    color: "#155724",
                    fontWeight: 500,
                },
            };
        }
    };

    const goToExamResult = (exam) => {
        navigate(`${exam.id}/result`, {
            state: { totalScore: exam.totalScore },
        });
    };
    const goToTakeExam = (exam) => {
        navigate(`${exam.id}/take`, { state: { exam } });
    };

    // 현재 시간
    const now = new Date();

    return (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h5">시험 목록</Typography>
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
                                <col style={{ width: "15%" }} />
                                <col style={{ width: "14%" }} />
                                <col style={{ width: "14%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "7%" }} />
                            </colgroup>
                            <TableHead>
                                <TableRow>
                                    <TableCell>제목</TableCell>
                                    <TableCell>시작</TableCell>
                                    <TableCell>종료</TableCell>
                                    <TableCell>상태</TableCell>
                                    <TableCell align="center">
                                        내 점수
                                    </TableCell>
                                    <TableCell align="center">총점</TableCell>
                                    <TableCell align="center">작업</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {exams.map((exam) => {
                                    const start = new Date(exam.startTime);
                                    const end = new Date(exam.endTime);
                                    const isAvailable =
                                        now >= start && now <= end;
                                    return (
                                        <TableRow key={exam.id}>
                                            <TableCell>{exam.title}</TableCell>
                                            <TableCell>
                                                {start.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {end.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    {...getStatusChipProps(
                                                        exam.hasTaken
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                {exam.hasTaken
                                                    ? `${exam.score}점`
                                                    : "-"}
                                            </TableCell>
                                            <TableCell align="center">
                                                {`${exam.totalScore}점`}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip
                                                    title={
                                                        exam.hasTaken
                                                            ? "다시보기"
                                                            : isAvailable
                                                              ? "응시하기"
                                                              : "응시 불가"
                                                    }
                                                >
                                                    {/* disabled 상태에서도 span이 이벤트를 전달해 줍니다 */}
                                                    <span>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() =>
                                                                exam.hasTaken
                                                                    ? goToExamResult(
                                                                          exam
                                                                      )
                                                                    : goToTakeExam(
                                                                          exam
                                                                      )
                                                            }
                                                            disabled={
                                                                !exam.hasTaken &&
                                                                !isAvailable
                                                            }
                                                        >
                                                            {exam.hasTaken ? (
                                                                <HistoryIcon />
                                                            ) : (
                                                                <PlayArrowIcon />
                                                            )}
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
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
