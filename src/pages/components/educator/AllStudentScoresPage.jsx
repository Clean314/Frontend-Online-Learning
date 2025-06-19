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
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getStudentExamSubmissionsAPI } from "../../../api/exam";
import { getCourseInfoAPI } from "../../../api/course";

export default function AllStudentScoresPage() {
    const { courseId, examId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { totalScore } = location.state || {};

    const [scores, setScores] = useState([]);
    const [totalStudents, setTotalStudents] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const submittedScores = scores.filter((s) => s.submitted);
    const averageScore =
        submittedScores.length > 0
            ? (
                  submittedScores.reduce(
                      (sum, item) => sum + item.totalScore,
                      0
                  ) / submittedScores.length
              ).toFixed(1)
            : 0;

    useEffect(() => {
        const loadScoresAndStudents = async () => {
            try {
                const [submissions, courseInfo] = await Promise.all([
                    getStudentExamSubmissionsAPI(
                        Number(courseId),
                        Number(examId)
                    ),
                    getCourseInfoAPI(Number(courseId)),
                ]);

                setScores(submissions);
                const total =
                    courseInfo.max_enrollment - courseInfo.available_enrollment;
                setTotalStudents(total);
            } catch (err) {
                console.error("성적 또는 수강자 수 조회 실패:", err);
                setError("성적 정보를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        if (courseId && examId) {
            loadScoresAndStudents();
        }
    }, [courseId, examId]);

    const handleBack = () => {
        navigate(`/courses/${courseId}/classroom/teach/exams`);
    };

    return (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <IconButton onClick={handleBack} sx={{ mr: 1 }}>
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
                        <Box display="flex" gap={4} mb={2}>
                            <Typography>
                                <Box
                                    component="span"
                                    fontWeight="fontWeightBold"
                                >
                                    응시자 수:
                                </Box>{" "}
                                {submittedScores.length} / {totalStudents}
                            </Typography>
                            <Typography>
                                <Box
                                    component="span"
                                    fontWeight="fontWeightBold"
                                >
                                    평균 점수:
                                </Box>{" "}
                                {averageScore} / {totalScore}점
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
                                                {item.submitted
                                                    ? `${item.totalScore}점`
                                                    : "미응시"}
                                            </TableCell>
                                            <TableCell align="center">
                                                {item.submitted ? (
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() =>
                                                            navigate(
                                                                `${item.studentId}`,
                                                                {
                                                                    state: {
                                                                        totalScore,
                                                                        student:
                                                                            item, // 학생 정보 전체 전달
                                                                    },
                                                                }
                                                            )
                                                        }
                                                    >
                                                        상세보기
                                                    </Button>
                                                ) : (
                                                    "-"
                                                )}
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
