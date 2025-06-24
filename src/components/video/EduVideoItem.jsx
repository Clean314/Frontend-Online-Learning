import {
    Box,
    Paper,
    ListItem,
    ListItemText,
    Typography,
    useTheme,
} from "@mui/material";
import { formatDate, formatDuration } from "../../utils/videoUtils";

/**
 * 강의자용 강의 영상 항목
 *
 * @param {Object} props
 * @param {Object} props.video - 영상 데이터
 * @param {number} props.index - 리스트에서의 순번
 * @param {Function} props.onPreview - 영상 클릭 시 실행되는 미리보기 핸들러
 */
export default function EduVideoItem({ video, index, onPreview }) {
    const theme = useTheme();

    return (
        <Paper
            elevation={3}
            sx={{ mb: 2, borderRadius: 2, bgcolor: "background.default" }}
        >
            <ListItem
                alignItems="flex-start"
                sx={{ py: 2, px: 2, cursor: "pointer" }}
                onClick={() => onPreview(video.videoUrl)}
            >
                <Box sx={{ display: "flex", gap: 2 }}>
                    {video.thumbnail && (
                        <img
                            src={video.thumbnail}
                            alt="썸네일"
                            width={160}
                            height={90}
                            style={{
                                borderRadius: 8,
                                objectFit: "cover",
                                backgroundColor: "#000",
                            }}
                        />
                    )}
                    <ListItemText
                        disableTypography
                        primary={
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                color={theme.palette.text.primary}
                            >
                                {index + 1}. {video.title}
                            </Typography>
                        }
                        secondary={
                            <Box mt={1}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 0.5 }}
                                >
                                    URL:{" "}
                                    <a
                                        href={video.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            textDecoration: "underline",
                                            color: theme.palette.primary.main,
                                        }}
                                    >
                                        {video.videoUrl}
                                    </a>
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    길이: {formatDuration(video.duration)} |
                                    등록일: {formatDate(video.publishedAt)}
                                </Typography>
                            </Box>
                        }
                    />
                </Box>
            </ListItem>
        </Paper>
    );
}
