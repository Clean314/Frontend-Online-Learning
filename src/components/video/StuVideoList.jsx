import { Paper, Typography, Divider, List } from "@mui/material";
import StuVideoItem from "./StuVideoItem";

/**
 * 강의 영상 전체 리스트 출력 컴포넌트
 *
 * @param {Object} props
 * @param {Array} props.videos - 강의 영상 배열
 * @param {Function} props.onItemClick - 항목 클릭 핸들러
 */
export default function StuVideoList({ videos, onItemClick }) {
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
                    <StuVideoItem
                        key={video.id || idx}
                        video={video}
                        index={idx}
                        onClick={() => onItemClick(video)}
                    />
                ))}
            </List>
        </Paper>
    );
}
