import { Box, CircularProgress, Typography } from "@mui/material";

/**
 * 시험 폼의 헤더 (타이틀 및 로딩 처리)
 * @param {Object} props
 * @param {boolean} props.isEditMode - 수정 모드 여부
 * @param {boolean} props.loading - 로딩 여부
 */
export default function ExamFormHeader({ isEditMode, loading }) {
    return loading ? (
        <Box textAlign="center" py={5}>
            <CircularProgress />
        </Box>
    ) : (
        <Typography variant="h5" mb={2}>
            {isEditMode ? "시험 수정" : "새 시험 생성"}
        </Typography>
    );
}
