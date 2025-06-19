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
import { useParams } from "react-router-dom";
import { getCourseAttendanceListAPI } from "../../../api/lectureHistory";
export default function ClassAttendancePage() {
    const { courseId } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const data = await getCourseAttendanceListAPI(Number(courseId));
                setAttendance(data);
            } catch (err) {
                console.error("출석 정보 조회 실패:", err);
                setError("출석 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
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

    const getRateChipProps = (rate) => {
        const pct = Math.round(rate);
        if (pct >= 80) {
            return {
                label: `${pct}%`,
                sx: {
                    bgcolor: "#D0F0C0",
                    color: "#2E7D32",
                    fontWeight: 500,
                },
            };
        }
        if (pct >= 50) {
            return {
                label: `${pct}%`,
                sx: {
                    bgcolor: "#FFF9C4",
                    color: "#F9A825",
                    fontWeight: 500,
                },
            };
        }
        return {
            label: `${pct}%`,
            sx: {
                bgcolor: "#FFEBEE",
                color: "#C62828",
                fontWeight: 500,
            },
        };
    };

    const averageRate = attendance.length
        ? `${Math.round(
              attendance.reduce((sum, row) => sum + row.attendanceAvg, 0) /
                  attendance.length
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
                            {attendance.map((row, idx) => (
                                <TableRow key={`${row.studentName}-${idx}`}>
                                    <TableCell>{row.studentName}</TableCell>
                                    <TableCell align="center">
                                        {row.totalCourse}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.attendanceTrue}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.attendanceFalse}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            {...getRateChipProps(
                                                row.attendanceAvg
                                            )}
                                            size="medium"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
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
