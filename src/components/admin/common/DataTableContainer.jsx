import { TableContainer, Paper } from "@mui/material";

/**
 * 테이블 래핑 컨테이너
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - 테이블 요소
 */
export default function DataTableContainer({ children }) {
    return (
        <TableContainer component={Paper} elevation={3}>
            {children}
        </TableContainer>
    );
}
