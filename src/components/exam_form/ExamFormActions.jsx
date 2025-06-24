import { Box, Button } from "@mui/material";

/**
 * 시험 폼의 액션 버튼들
 *
 * @param {Object} props
 * @param {Function} props.onCancel - 취소 버튼 핸들러
 * @param {Function} props.onSubmit - 저장 버튼 핸들러
 */
export default function ExamFormActions({ onCancel, onSubmit }) {
    return (
        <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="outlined" onClick={onCancel} sx={{ mr: 1 }}>
                취소
            </Button>
            <Button variant="contained" onClick={onSubmit}>
                저장
            </Button>
        </Box>
    );
}
