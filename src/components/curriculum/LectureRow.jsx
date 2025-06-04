import { Box, Typography, TextField, IconButton } from "@mui/material";
import { Remove as RemoveIcon } from "@mui/icons-material";

/**
 * 개별 강의 영상 행
 * @param index -- 목록 내 강의의 인덱스 (1-based 앞번호 표시용)
 * @param lecture -- 현재 행에 해당하는 강의 객체 (id, title, videoUrl)
 * @param onChange -- 필드 변경 시 호출되는 핸들러
 * @param onRemove -- 삭제 버튼 클릭 시 호출되는 핸들러
 * @param disableRemove -- 행 삭제 버튼을 비활성화할지 여부 (lecture 목록이 1개일 때 true)
 */
export default function LectureRow({
    index,
    lecture,
    onChange,
    onRemove,
    disableRemove,
}) {
    return (
        <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Typography sx={{ width: 24, textAlign: "center" }}>
                {index + 1}.
            </Typography>
            <TextField
                label="강의 제목"
                value={lecture.title}
                onChange={onChange(index, "title")}
                fullWidth
                required
            />
            <TextField
                label="영상 URL"
                value={lecture.videoUrl}
                onChange={onChange(index, "videoUrl")}
                fullWidth
                required
            />
            <IconButton onClick={onRemove(index)} disabled={disableRemove}>
                <RemoveIcon />
            </IconButton>
        </Box>
    );
}
