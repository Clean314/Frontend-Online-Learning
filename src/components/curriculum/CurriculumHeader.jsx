import { Typography } from "@mui/material";

/**
 * 커리큘럼 헤더
 * @param isEditMode -- 편집 모드 여부 (true일 때 “커리큘럼 수정”, false일 때 “커리큘럼” 텍스트 표시)
 */
export default function CurriculumHeader({ isEditMode }) {
    const titleText = isEditMode ? "커리큘럼 수정" : "커리큘럼";
    return (
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            {titleText}
        </Typography>
    );
}
