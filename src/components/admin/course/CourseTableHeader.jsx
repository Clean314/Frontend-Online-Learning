import { TableHead, TableRow, TableCell } from "@mui/material";

/**
 * 강의 테이블 헤더 (ID, 강의명, 강사, 카테고리, 난이도, 학점, 최대인원, 액션 컬럼)
 */
export default function CourseTableHeader() {
    return (
        <>
            <colgroup>
                <col style={{ width: "5%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "10%" }} />
            </colgroup>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>강의명</TableCell>
                    <TableCell>강사</TableCell>
                    <TableCell>카테고리</TableCell>
                    <TableCell>난이도</TableCell>
                    <TableCell>학점</TableCell>
                    <TableCell>최대인원</TableCell>
                    <TableCell align="right" />
                </TableRow>
            </TableHead>
        </>
    );
}
