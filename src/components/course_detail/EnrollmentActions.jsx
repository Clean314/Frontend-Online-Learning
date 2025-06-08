import { Box, Button } from "@mui/material";

/**
 * 수강 신청/취소 버튼
 * @param {boolean} isStudent -- STUDENT 역할 여부
 * @param {boolean} isEnrolled -- 현재 수강 중 여부
 * @param {() => void} onEnroll -- 수강 신청 핸들러
 * @param {() => void} onCancel -- 수강 취소 핸들러
 */
export default function EnrollmentActions({
    isStudent,
    isEnrolled,
    onEnroll,
    onCancel,
}) {
    if (!isStudent) return null;
    return (
        <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
        >
            <Button
                size="medium"
                variant="contained"
                color={isEnrolled ? "error" : "primary"}
                onClick={isEnrolled ? onCancel : onEnroll}
            >
                {isEnrolled ? "수강 취소" : "수강 신청"}
            </Button>
        </Box>
    );
}
