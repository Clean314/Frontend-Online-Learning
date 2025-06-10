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
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function AllStudentScoresPage() {
    const { courseId, examId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    // 상위에서 받아온 totalScore
    const { totalScore } = location.state || {};

    const [scores, setScores] = useState([]);
    const [totalStudents, setTotalStudents] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 평균 점수 계산
    const averageScore =
        scores.length > 0
            ? (
                  scores.reduce((sum, item) => sum + item.score, 0) /
                  scores.length
              ).toFixed(1)
            : 0;

    useEffect(() => {
        // TODO: API 호출 구현 필요
        // getAllStudentScoresAPI(courseId, examId) → setScores(...)
        // getCourseEnrollmentCountAPI(courseId) → setTotalStudents(...)
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
        const dummyTotalStudents = 10; // 전체 수강자 수

        setTimeout(() => {
            setScores(dummyScores);
            setTotalStudents(dummyTotalStudents);
            setLoading(false);
        }, 500);
    }, [courseId, examId]);

    return (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
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
                    <>
                        {/* 응시자 수 / 전체 수강자 수, 평균 점수 */}
                        <Box display="flex" gap={4} mb={2}>
                            <Typography>
                                <Box
                                    component="span"
                                    fontWeight="fontWeightBold"
                                >
                                    응시자 수:
                                </Box>{" "}
                                {scores.length} / {totalStudents}
                            </Typography>
                            <Typography>
                                <Box
                                    component="span"
                                    fontWeight="fontWeightBold"
                                >
                                    평균 점수:
                                </Box>{" "}
                                {averageScore}점
                            </Typography>
                        </Box>

                        <TableContainer>
                            <Table>
                                <colgroup>
                                    <col style={{ width: "15%" }} />
                                    <col style={{ width: "25%" }} />
                                    <col style={{ width: "15%" }} />
                                    <col style={{ width: "25%" }} />
                                </colgroup>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>학생 이름</TableCell>
                                        <TableCell align="center">
                                            점수
                                        </TableCell>
                                        <TableCell align="center">
                                            작업
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {scores.map((item) => (
                                        <TableRow key={item.studentId}>
                                            <TableCell>
                                                {item.studentId}
                                            </TableCell>
                                            <TableCell>
                                                {item.studentName}
                                            </TableCell>
                                            <TableCell align="center">
                                                {item.score}점
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() =>
                                                        navigate(
                                                            `${item.studentId}`,
                                                            {
                                                                state: {
                                                                    totalScore,
                                                                },
                                                            }
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
                                            <TableCell
                                                colSpan={4}
                                                align="center"
                                            >
                                                응시자가 없습니다.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Paper>
        </Container>
    );
}
