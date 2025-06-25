import { Box, Button, CircularProgress } from "@mui/material";

/**
 * 문제 폼 저장/취소 버튼 컴포넌트
 *
 * @param {Object} props
 * @param {boolean} props.loading - 저장 중 로딩 상태
 * @param {() => void} props.onSubmit - 저장 버튼 클릭 시 동작
 * @param {() => void} props.onCancel - 취소 버튼 클릭 시 동작
 */
export default function QuestionFormActions({ loading, onSubmit, onCancel }) {
    return (
        <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="outlined" onClick={onCancel} sx={{ mr: 1 }}>
                취소
            </Button>
            <Button variant="contained" onClick={onSubmit} disabled={loading}>
                {loading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    "저장"
                )}
            </Button>
        </Box>
    );
}
