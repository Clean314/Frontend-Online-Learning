import {
    Box,
    Checkbox,
    FormControlLabel,
    Typography,
    Select,
    MenuItem,
} from "@mui/material";

/**
 * 강의 목록 상단 필터
 * @param {string} role -- 사용자 역할 ("STUDENT"|"EDUCATOR")
 * @param {boolean} excludeEnrolled -- 체크박스 상태
 * @param {(e) => void} onToggleExclude -- 체크박스 토글 핸들러
 * @param {number} rowsPerPage
 * @param {(e) => void} onChangeRowsPerPage
 */
export default function CourseListFilter({
    role,
    excludeEnrolled,
    onToggleExclude,
    rowsPerPage,
    onChangeRowsPerPage,
}) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
            }}
        >
            {role === "STUDENT" && (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={excludeEnrolled}
                            onChange={onToggleExclude}
                        />
                    }
                    label="수강 중인 강의 제외하기"
                />
            )}
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                    페이지당:
                </Typography>
                <Select
                    size="small"
                    value={rowsPerPage}
                    onChange={onChangeRowsPerPage}
                >
                    {[5, 10, 20].map((n) => (
                        <MenuItem key={n} value={n}>
                            {n}개
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        </Box>
    );
}
