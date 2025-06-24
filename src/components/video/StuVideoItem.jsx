import {
    Box,
    Paper,
    ListItemButton,
    ListItemText,
    Typography,
    Chip,
} from "@mui/material";
import { formatDate, formatDuration } from "../../utils/videoUtils";

/**
 * 개별 강의 영상 항목 컴포넌트
 *
 * @param {Object} props
 * @param {Object} props.video - 영상 정보 객체
 * @param {number} props.index - 영상 인덱스
 * @param {Function} props.onClick - 클릭 시 실행할 함수
 */
export default function StuVideoItem({ video, index, onClick }) {
    return (
        <Paper
            elevation={3}
            sx={{
                mb: 2,
                borderRadius: 2,
                bgcolor: "background.default",
            }}
        >
            <ListItemButton
                onClick={onClick}
                alignItems="flex-start"
                sx={{ py: 2, px: 2 }}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "flex-start",
                        width: "100%",
                    }}
                >
                    {video.thumbnail && (
                        <Box
                            sx={{
                                width: 160,
                                height: 90,
                                borderRadius: 2,
                                backgroundImage: `url(${video.thumbnail})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundColor: "#000",
                                flexShrink: 0,
                            }}
                        />
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                        <ListItemText
                            disableTypography
                            primary={
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                >
                                    {index + 1}. {video.title}
                                </Typography>
                            }
                            secondary={
                                <Box mt={1}>
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
                    {video.watched && (
                        <Chip
                            label="수강 완료"
                            variant="outlined"
                            color="success"
                            sx={{
                                borderWidth: 1.5,
                                borderColor: "success.main",
                                color: "success.main",
                                fontWeight: 600,
                                alignSelf: "center",
                            }}
                        />
                    )}
                </Box>
            </ListItemButton>
        </Paper>
    );
}
