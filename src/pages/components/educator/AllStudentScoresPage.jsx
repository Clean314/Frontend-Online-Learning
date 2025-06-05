import React, { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    IconButton,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

export default function AllStudentScoresPage() {
    const { courseId, examId } = useParams();
    const navigate = useNavigate();

    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // TODO: API 호출 구현 필요 (getAllStudentScoresAPI)
        // 임시 데이터로 화면 렌더링 테스트
        const dummyScores = [
            {
                studentId: "2023001",
                studentName: "김철수",
                score: 85,
                submittedAt: "2025-06-10T11:05:00",
            },
            {
                studentId: "2023002",
                studentName: "이영희",
                score: 92,
                submittedAt: "2025-06-10T11:02:00",
            },
            {
                studentId: "2023003",
                studentName: "박민수",
                score: 78,
                submittedAt: "2025-06-10T11:10:00",
            },
        ];

        setTimeout(() => {
            setScores(dummyScores);
            setLoading(false);
        }, 500);
    }, [courseId, examId]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5">전체 학생 성적 조회</Typography>
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
                                <col style={{ width: "25%" }} />
                                <col style={{ width: "15%" }} />
                                <col style={{ width: "20%" }} />
                                <col style={{ width: "25%" }} />
                            </colgroup>
                            <TableHead>
                                <TableRow>
                                    <TableCell>학번</TableCell>
                                    <TableCell>학생 이름</TableCell>
                                    <TableCell align="center">점수</TableCell>
                                    <TableCell>응시 시간</TableCell>
                                    <TableCell align="center">작업</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {scores.map((item) => (
                                    <TableRow key={item.studentId}>
                                        <TableCell>{item.studentId}</TableCell>
                                        <TableCell>
                                            {item.studentName}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.score}점
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                item.submittedAt
                                            ).toLocaleString()}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() =>
                                                    navigate(
                                                        `/courses/${courseId}/exams/${examId}/results/${item.studentId}`
                                                    )
                                                }
                                            >
                                                상세보기
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {scores.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            응시자가 없습니다.
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
