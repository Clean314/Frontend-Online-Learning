import { Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

/**
 * “강의 추가” 버튼
 * @param onClick -- 버튼 클릭 시 호출되는 핸들러 (새 강의 행 추가)
 */
export default function AddLectureButton({ onClick }) {
    return (
        <Button startIcon={<AddIcon />} onClick={onClick} sx={{ mb: 3 }}>
            강의 추가
        </Button>
    );
}
