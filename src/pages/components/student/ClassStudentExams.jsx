import { useState, useEffect, useRef } from "react";
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
import {
    getStudentExamListAPI,
    getStudentExamScoreAPI,
    startExamAPI,
} from "../../../api/exam";
import { getStudentQuestionListAPI } from "../../../api/question";

export default function ClassStudentExams() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const refreshTimer = useRef(null);

    // 시험 목록 조회 + 자동 재조회 스케줄링
    const fetchExams = async () => {
        clearTimeout(refreshTimer.current);

        try {
            setLoading(true);
            const data = await getStudentExamListAPI(Number(courseId));

            const examList = await Promise.all(
                data.map(async (e) => {
                    const startTime = new Date(e.start_time);
                    const endTime = new Date(e.end_time);

                    let hasTaken = false;
                    let score = 0;
                    let totalScore = 0;
                    let questionCount = 0;

                    try {
                        const result = await getStudentExamScoreAPI(
                            courseId,
                            e.id
                        );
                        if (result) {
                            hasTaken = true;
                            score = result;
                        }
                    } catch (err) {
                        console.error("성적 조회 실패:", err);
                    }

                    try {
                        // 시험 총점 계산을 위해 문제 리스트 호출
                        const questionRes = await getStudentQuestionListAPI(
                            Number(courseId),
                            Number(e.id)
                        );
                        totalScore = questionRes.reduce(
                            (sum, q) => sum + q.score,
                            0
                        );
                        questionCount = questionRes.length;
                    } catch (err) {
                        console.error("총점 계산용 문제 불러오기 실패:", err);
                    }

                    return {
                        id: e.id,
                        title: e.title,
                        startTime,
                        endTime,
                        status: e.status,
                        hasTaken,
                        score,
                        totalScore,
                        questionCount,
                    };
                })
            );

            const sorted = examList.sort((a, b) => a.startTime - b.startTime);
            setExams(sorted);
            setError(null);

            // 다음 이벤트(가장 빠른 start + 25s) 기준으로 재조회 예약
            const now = new Date();
            const futureStartTimes = sorted
                .map((ex) => new Date(ex.startTime.getTime() + 25 * 1000))
                .filter((t) => t > now);

            if (futureStartTimes.length > 0) {
                const next = futureStartTimes.sort((a, b) => a - b)[0];
                const delay = next - now + 1000; // 1초 여유
                refreshTimer.current = setTimeout(fetchExams, delay);
            }
        } catch (err) {
            console.error(err);
            setError("시험 목록을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
        return () => clearTimeout(refreshTimer.current);
    }, [courseId]);

    // 응시하기 버튼 핸들러: 시간 재검사
    const handleTakeExam = async (exam) => {
        const now = new Date();
        if (now < exam.startTime || now > exam.endTime) {
            alert("지금은 응시 가능한 시간이 아닙니다.");
            return;
        }

        try {
            await startExamAPI(courseId, exam.id); // 시험 시작 API 호출
            navigate(`${exam.id}/take`, { state: { exam } });
        } catch (err) {
            console.error("시험 시작 실패:", err);
            alert("시험을 시작하는 데 실패했습니다. 관리자에게 문의하세요.");
        }
    };

    // 상태 칩 설정
    const getStatusChipProps = (status) => {
        switch (status) {
            case "PREPARING":
                return { label: "준비중", color: "default" };
            case "IN_PROGRESS":
                return { label: "진행중", color: "primary" };
            case "COMPLETED":
                return { label: "종료", color: "default" };
            default:
                return { label: status, color: "default" };
        }
    };

    // 응시 여부 칩 설정
    const getTakenChipProps = (hasTaken) => {
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
                                <col style={{ width: "14%" }} />
                                <col style={{ width: "14%" }} />
                                <col style={{ width: "14%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "5%" }} />
                            </colgroup>
                            <TableHead>
                                <TableRow>
                                    <TableCell>제목</TableCell>
                                    <TableCell>시작</TableCell>
                                    <TableCell>종료</TableCell>
                                    <TableCell>상태</TableCell>
                                    <TableCell>응시 여부</TableCell>
                                    <TableCell align="center">
                                        내 점수
                                    </TableCell>
                                    <TableCell align="center">총점</TableCell>
                                    <TableCell align="center">
                                        문항 수
                                    </TableCell>
                                    <TableCell align="center">작업</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {exams.map((exam) => (
                                    <TableRow key={exam.id}>
                                        <TableCell>{exam.title}</TableCell>
                                        <TableCell>
                                            {exam.startTime.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {exam.endTime.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                {...getStatusChipProps(
                                                    exam.status
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                {...getTakenChipProps(
                                                    exam.hasTaken
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {exam.hasTaken
                                                ? `${exam.score}점`
                                                : exam.status === "COMPLETED"
                                                  ? "0점"
                                                  : "-"}
                                        </TableCell>
                                        <TableCell align="center">
                                            {`${exam.totalScore}점`}
                                        </TableCell>
                                        <TableCell align="center">
                                            {exam.questionCount}
                                        </TableCell>
                                        <TableCell align="center">
                                            {/* 응시하기: IN_PROGRESS 이면서 hasTaken === false 일 때만 */}
                                            {!exam.hasTaken &&
                                                exam.status ===
                                                    "IN_PROGRESS" && (
                                                    <Tooltip title="응시하기">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() =>
                                                                handleTakeExam(
                                                                    exam
                                                                )
                                                            }
                                                        >
                                                            <PlayArrowIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {exams.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
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
