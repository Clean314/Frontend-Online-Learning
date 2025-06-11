import React, { useState, useEffect } from "react";
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
    CircularProgress,
    Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";

export default function ClassAttendancePage() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        // TODO: API 호출 구현 필요 (getCourseAttendanceAPI)
        const dummy = [
            {
                studentId: 1,
                studentName: "김철수",
                totalLectures: 5,
                attended: 5,
            },
            {
                studentId: 2,
                studentName: "이영희",
                totalLectures: 5,
                attended: 3,
            },
            {
                studentId: 3,
                studentName: "박민수",
                totalLectures: 5,
                attended: 4,
            },
            {
                studentId: 4,
                studentName: "최지은",
                totalLectures: 5,
                attended: 2,
            },
            {
                studentId: 5,
                studentName: "오민준",
                totalLectures: 5,
                attended: 5,
            },
        ];
        setTimeout(() => {
            setAttendance(dummy);
            setLoading(false);
        }, 500);
    }, [courseId]);

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                <CircularProgress />
            </Box>
        );
    }
    if (error) {
        return (
            <Box textAlign="center" py={10}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    const formatRate = (attended, total) =>
        `${Math.round((attended / total) * 100)}%`;

    // 파스텔 톤 Chip 스타일
    const getRateChipProps = (rate) => {
        const pct = parseInt(rate, 10);
        if (pct >= 80) {
            // 파스텔 민트
            return {
                label: rate,
                sx: {
                    bgcolor: "#D0F0C0",
                    color: "#2E7D32",
                    fontWeight: 500,
                },
            };
        }
        if (pct >= 50) {
            // 파스텔 옐로우
            return {
                label: rate,
                sx: {
                    bgcolor: "#FFF9C4",
                    color: "#F9A825",
                    fontWeight: 500,
                },
            };
        }
        // 파스텔 핑크
        return {
            label: rate,
            sx: {
                bgcolor: "#FFEBEE",
                color: "#C62828",
                fontWeight: 500,
            },
        };
    };

    // 평균 출석률 계산
    const averageRate = attendance.length
        ? `${Math.round(
              (attendance.reduce(
                  (sum, row) => sum + row.attended / row.totalLectures,
                  0
              ) /
                  attendance.length) *
                  100
          )}%`
        : "-";

    return (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box display={"flex"} justifyContent={"space-between"} mb={2}>
                    <Typography variant="h5">수강생 출결 현황</Typography>
                    <Typography variant="body1">
                        평균 출석률: {averageRate}
                    </Typography>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>학생 이름</TableCell>
                                <TableCell align="center">총 강의 수</TableCell>
                                <TableCell align="center">출석</TableCell>
                                <TableCell align="center">미출석</TableCell>
                                <TableCell align="center">출석률</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attendance.map((row) => {
                                const absent = row.totalLectures - row.attended;
                                const rate = formatRate(
                                    row.attended,
                                    row.totalLectures
                                );
                                return (
                                    <TableRow key={row.studentId}>
                                        <TableCell>{row.studentName}</TableCell>
                                        <TableCell align="center">
                                            {row.totalLectures}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.attended}
                                        </TableCell>
                                        <TableCell align="center">
                                            {absent}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                {...getRateChipProps(rate)}
                                                size="medium"
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {attendance.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        등록된 수강생이 없습니다.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
}
