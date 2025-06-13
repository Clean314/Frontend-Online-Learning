import { TableHead, TableRow, TableCell } from "@mui/material";

/**
 * 회원 테이블 헤더 (ID, 이름, 이메일, 역할, 액션 컬럼)
 */
export default function UserTableHeader() {
    return (
        <>
            <colgroup>
                <col style={{ width: "10%" }} />
                <col style={{ width: "17%" }} />
                <col style={{ width: "40%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "10%" }} />
            </colgroup>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>이메일</TableCell>
                    <TableCell>역할</TableCell>
                    <TableCell align="right" />
                </TableRow>
            </TableHead>
        </>
    );
}
