import { Box, Typography, TableContainer, Paper } from "@mui/material";
import RecentTable from "../common/RecentTable";

/**
 * 최근 항목 섹션 (제목 + 테이블)
 * @param {Object} props
 * @param {string} props.title - 섹션 제목
 * @param {{ field: string, headerName: string }[]} props.columns - 테이블 컬럼 정의
 * @param {Object[]} props.data - 테이블 데이터
 */
export default function RecentSection({ title, columns, data }) {
    return (
        <Box mt={4}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <TableContainer component={Paper} elevation={2}>
                <RecentTable columns={columns} data={data} />
            </TableContainer>
        </Box>
    );
}
