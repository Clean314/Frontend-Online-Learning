import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";

/**
 * 최근 항목 테이블 (컬럼 + 데이터)
 * @param {Object} props
 * @param {{ field: string, headerName: string }[]} props.columns - 컬럼 정의 배열
 * @param {Object[]} props.data - 테이블에 표시할 데이터 배열
 */
export default function RecentTable({ columns, data }) {
    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    {columns.map((col) => (
                        <TableCell key={col.field}>{col.headerName}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((row) => (
                    <TableRow key={row[columns[0].field]} hover>
                        {columns.map((col) => (
                            <TableCell key={col.field}>
                                {row[col.field]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
