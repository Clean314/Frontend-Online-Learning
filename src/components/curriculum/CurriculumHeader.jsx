import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

/**
 * 커리큘럼 헤더
 * @param isEditMode -- 편집 모드 여부 (true일 때 “커리큘럼 수정”, false일 때 “커리큘럼” 텍스트 표시)
 */
export default function CurriculumHeader({ isEditMode }) {
    const navigate = useNavigate();
    const titleText = isEditMode ? "커리큘럼 수정" : "커리큘럼";

    return (
        <Box display={"flex"} alignItems={"center"} mb={2}>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {titleText}
            </Typography>
        </Box>
    );
}
