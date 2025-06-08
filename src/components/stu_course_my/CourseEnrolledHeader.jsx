import { Box, Typography, Select, MenuItem } from "@mui/material";

/**
 * 내 수강목록 헤더 (타이틀 + 페이지당 선택)
 * @param {string} status -- "total"|"enrolled"|"completed"
 * @param {number} rowsPerPage
 * @param {(e)=>void} onChangeRowsPerPage
 */
export default function CourseEnrolledHeader({
    status,
    rowsPerPage,
    onChangeRowsPerPage,
}) {
    const title =
        status === "total"
            ? "Total"
            : status === "enrolled"
              ? "수강중"
              : "수강 완료";
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
            }}
        >
            <Typography variant="h6">{title}</Typography>
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
