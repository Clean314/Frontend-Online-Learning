import { Paper, Typography, Divider, List, Box, Button } from "@mui/material";
import EduVideoItem from "./EduVideoItem";

/**
 * 강의자용 강의 영상 목록 전체 리스트
 *
 * @param {Object} props
 * @param {Array} props.videos - 영상 목록
 * @param {Function} props.onPreview - 영상 클릭 시 호출
 * @param {Function} props.onEdit - 영상 수정 버튼 클릭 시 호출
 */
export default function EduVideoList({ videos, onPreview, onEdit }) {
    return (
        <Paper sx={{ p: 3 }}>
            <Typography
                variant="subtitle1"
                sx={{ mb: 2 }}
                color="text.secondary"
            >
                총 강의 영상 수: <strong>{videos.length}개</strong>
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List>
                {videos.map((video, idx) => (
                    <EduVideoItem
                        key={video.id || idx}
                        video={video}
                        index={idx}
                        onPreview={onPreview}
                    />
                ))}
            </List>

            <Box textAlign="center" mt={3}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={onEdit}
                >
                    영상 수정
                </Button>
            </Box>
        </Paper>
    );
}
