import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";

/**
 * 페이지당 표시할 행 개수 선택 컴포넌트
 * @param {number} rowsPerPage -- 현재 페이지당 항목 수
 * @param {function} onChange -- 선택값 변경 핸들러 (e:ChangeEvent)
 */
export default function PageSizeSelect({ rowsPerPage, onChange }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                mb: 2,
            }}
        >
            <Typography variant="body2" sx={{ mr: 1 }}>
                페이지당:
            </Typography>
            <FormControl size="small">
                <Select value={rowsPerPage} onChange={onChange}>
                    {[5, 10, 20].map((n) => (
                        <MenuItem key={n} value={n}>
                            {n}개
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
