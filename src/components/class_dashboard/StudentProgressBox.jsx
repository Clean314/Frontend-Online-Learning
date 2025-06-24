import { Box, Typography, LinearProgress, Chip } from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import dayjs from "dayjs";

/**
 * 학생용 진행률 요약 박스
 *
 * @param nextExam -- 다음 시험 정보 (start, label 포함)
 * @param daysUntilNextExam -- D-Day (0: D-day, 양수: D-n, null: 없음)
 * @param myProgressRate -- 본인의 평균 수강률 (0~100)
 */
export default function StudentProgressBox({
    nextExam,
    daysUntilNextExam,
    myProgressRate,
}) {
    return (
        <Box display="flex" gap={10} mb={5}>
            {/* 다음 시험 D-Day */}
            <Box sx={{ flex: 1 }} display="flex" gap={4} alignItems="center">
                <ScheduleIcon sx={{ fontSize: 40, flex: 1 }} />
                <Box sx={{ flex: 3 }}>
                    <Typography variant="overline">다음 시험까지</Typography>
                    <Typography variant="h6">
                        {daysUntilNextExam == null
                            ? "-"
                            : daysUntilNextExam === 0
                              ? "D-day"
                              : `D-${daysUntilNextExam}`}
                    </Typography>
                    {nextExam && (
                        <Chip
                            label={`${nextExam.label} ${dayjs(
                                nextExam.start
                            ).format("MM월 DD일 HH:mm")}`}
                            size="small"
                            sx={{
                                mt: 0.5,
                                bgcolor: "#B2EBF2",
                                color: "#004D40",
                                fontWeight: 500,
                            }}
                        />
                    )}
                </Box>
            </Box>

            {/* 내 강의 진행률 */}
            <Box sx={{ flex: 1 }} display="flex" gap={4} alignItems="center">
                <ShowChartIcon sx={{ fontSize: 40, flex: 1 }} />
                <Box sx={{ flex: 3 }}>
                    <Typography variant="overline">내 강의 진행률</Typography>
                    <Typography variant="h6">
                        {myProgressRate !== null ? `${myProgressRate}%` : "0%"}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={myProgressRate || 0}
                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                </Box>
            </Box>
        </Box>
    );
}
