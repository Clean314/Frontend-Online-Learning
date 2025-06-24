import { Box, Typography, useTheme } from "@mui/material";
import { formatDate, formatDuration } from "../../utils/videoUtils";
import BackButton from "../common/BackButton";

/**
 * 강의 영상 상단 정보 영역 (제목, 등록일, 길이, 뒤로가기 버튼 포함)
 *
 * @param {Object} props
 * @param {Object} props.video - 영상 데이터
 * @param {Function} props.onBack - 뒤로가기 버튼 클릭 핸들러
 */
export default function VideoHeader({ video, onBack }) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <BackButton onClick={onBack} />
                <Typography
                    variant="h5"
                    sx={{ color: theme.palette.text.primary }}
                >
                    {video.title}
                </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
                길이: {formatDuration(video.duration)} • 등록일:{" "}
                {formatDate(video.publishedAt)}
            </Typography>
        </Box>
    );
}
