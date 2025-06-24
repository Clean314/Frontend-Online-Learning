import { Box, Typography, LinearProgress } from "@mui/material";

/**
 * 강의 영상 누적 시청 시간 및 수강 여부 표시 박스
 *
 * @param {Object} props
 * @param {number} props.totalWatched - 누적 시청 시간 (초)
 * @param {number} props.durationSec - 전체 영상 길이 (초)
 */
export default function WatchProgressBox({ totalWatched, durationSec }) {
    const attendanceRate = durationSec > 0 ? totalWatched / durationSec : 0;
    const isComplete = attendanceRate >= 0.5;

    const formatTimeFromSeconds = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        if (h > 0) {
            return `${h.toString().padStart(2, "0")}시간 ${m
                .toString()
                .padStart(2, "0")}분 ${s.toString().padStart(2, "0")}초`;
        } else if (m > 0) {
            return `${m.toString().padStart(2, "0")}분 ${s
                .toString()
                .padStart(2, "0")}초`;
        } else {
            return `${s.toString().padStart(2, "0")}초`;
        }
    };

    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: isComplete ? "#DDF6D2" : "#FFDCDC",
            }}
        >
            <Typography
                variant="body1"
                sx={{
                    fontWeight: 600,
                    color: isComplete ? "success.main" : "error.main",
                }}
            >
                {isComplete ? "✅ 수강 완료" : "❌ 미수강"}
            </Typography>

            <LinearProgress
                variant="determinate"
                value={Math.min(attendanceRate * 100, 100)}
                color={isComplete ? "success" : "error"}
                sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: (theme) => theme.palette.grey[200],
                    "& .MuiLinearProgress-bar": {
                        borderRadius: 5,
                    },
                }}
            />

            <Typography variant="body2" color="text.secondary" mt={0.5}>
                누적 시청 시간: {formatTimeFromSeconds(totalWatched)} /{" "}
                {formatTimeFromSeconds(durationSec)} (
                {durationSec > 0
                    ? `${Math.floor(attendanceRate * 100)}%`
                    : "0%"}
                )
            </Typography>
        </Box>
    );
}
