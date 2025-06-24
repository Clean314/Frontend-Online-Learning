import { Box, Typography, LinearProgress } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ShowChartIcon from "@mui/icons-material/ShowChart";

/**
 * 수강자 수 및 수강률 평균을 보여주는 통계 박스 컴포넌트
 *
 * @param currentEnrolled -- 현재 수강 중인 학생 수
 * @param maxEnrollment -- 최대 수강 가능 인원
 * @param avgAttendanceRate -- 평균 수강률 (0~100 정수)
 */
export default function EnrollmentStatsBox({
    currentEnrolled,
    maxEnrollment,
    avgAttendanceRate,
}) {
    const enrollmentRate = Math.round((currentEnrolled / maxEnrollment) * 100);

    return (
        <Box display="flex" gap={10} mb={5}>
            {/* 수강자 수 */}
            <Box sx={{ flex: 1 }} display="flex" gap={4} alignItems="center">
                <PeopleIcon sx={{ fontSize: 40, flex: 1 }} />
                <Box sx={{ flex: 3 }}>
                    <Typography variant="overline">수강자 수</Typography>
                    <Box display="flex" alignItems="flex-end" gap={2}>
                        <Typography variant="h6">
                            {currentEnrolled}명
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            ({enrollmentRate}% / 최대 {maxEnrollment}명)
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={enrollmentRate}
                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                </Box>
            </Box>

            {/* 수강률 평균 */}
            <Box sx={{ flex: 1 }} display="flex" gap={4} alignItems="center">
                <ShowChartIcon sx={{ fontSize: 40, flex: 1 }} />
                <Box sx={{ flex: 3 }}>
                    <Typography variant="overline">수강률 평균</Typography>
                    <Typography variant="h6">
                        {avgAttendanceRate != null
                            ? `${avgAttendanceRate}%`
                            : "N/A"}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={avgAttendanceRate || 0}
                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                </Box>
            </Box>
        </Box>
    );
}
