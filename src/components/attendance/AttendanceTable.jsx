import {
    Typography,
    Box,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
} from "@mui/material";

/**
 * 출석 테이블
 *
 * @param {Object} props
 * @param {Object[]} props.attendance - 출석 정보 배열
 */
export default function AttendanceTable({ attendance }) {
    const averageRate = attendance.length
        ? `${Math.round(
              attendance.reduce((sum, row) => sum + row.attendanceAvg, 0) /
                  attendance.length
          )}%`
        : "-";

    const getRateChipProps = (rate) => {
        const pct = Math.round(rate);
        if (pct >= 80) {
            return {
                label: `${pct}%`,
                sx: { bgcolor: "#D0F0C0", color: "#2E7D32", fontWeight: 500 },
            };
        }
        if (pct >= 50) {
            return {
                label: `${pct}%`,
                sx: { bgcolor: "#FFF9C4", color: "#F9A825", fontWeight: 500 },
            };
        }
        return {
            label: `${pct}%`,
            sx: { bgcolor: "#FFEBEE", color: "#C62828", fontWeight: 500 },
        };
    };

    return (
        <>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">수강생 출결 현황</Typography>
                <Typography variant="body1">
                    평균 출석률: {averageRate}
                </Typography>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>학생 이름</TableCell>
                            <TableCell align="center">총 강의 수</TableCell>
                            <TableCell align="center">출석</TableCell>
                            <TableCell align="center">미출석</TableCell>
                            <TableCell align="center">출석률</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendance.map((row, idx) => (
                            <TableRow key={`${row.memberId}-${idx}`}>
                                <TableCell>{row.memberId}</TableCell>
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
                                        {...getRateChipProps(row.attendanceAvg)}
                                        size="medium"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                        {attendance.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    등록된 수강생이 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
