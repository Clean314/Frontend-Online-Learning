import {
    Box,
    Typography,
    Select,
    MenuItem,
    TextField,
    IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

/**
 * 필터 바 컴포넌트
 * @param {Object} props
 * @param {number} props.rowsPerPage - 페이지당 표시할 항목 수
 * @param {function} props.onRowsPerPageChange - 페이지당 항목 수 변경 핸들러
 * @param {string} props.searchValue - 검색어
 * @param {function} props.onSearchChange - 검색어 변경 핸들러
 * @param {function} props.onSearch - 검색 실행 핸들러
 * @param {number} props.totalCount - 전체 항목 개수
 */
export default function FilterBar({
    rowsPerPage,
    onRowsPerPageChange,
    searchValue,
    onSearchChange,
    onSearch,
    totalCount,
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                    페이지당:
                </Typography>
                <Select
                    size="small"
                    value={rowsPerPage}
                    onChange={onRowsPerPageChange}
                    sx={{ mr: 2 }}
                >
                    {[5, 10, 20].map((n) => (
                        <MenuItem key={n} value={n}>
                            {n}개
                        </MenuItem>
                    ))}
                </Select>
                <TextField
                    size="small"
                    placeholder="검색"
                    value={searchValue}
                    onChange={onSearchChange}
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                    sx={{ mr: 1, width: 200 }}
                />
                <IconButton color="primary" onClick={onSearch}>
                    <SearchIcon />
                </IconButton>
            </Box>
            <Typography variant="body2">총 {totalCount}개</Typography>
        </Box>
    );
}
