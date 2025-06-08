import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";
import CourseEnrolledRow from "./CourseEnrolledRow";

/**
 * 내 수강목록 테이블 전체
 * @param {array} items
 * @param {(id:number)=>void} onCancel
 * @param {object} difficultyMap
 */
export default function CourseEnrolledTable({ items, onCancel }) {
    return (
        <TableContainer sx={{ tableLayout: "fixed", width: "100%" }}>
            <Table>
                <colgroup>
                    <col style={{ width: "7%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "7%" }} />
                    <col style={{ width: "2%" }} />
                </colgroup>
                <TableHead>
                    <TableRow
                        sx={(theme) => ({
                            bgcolor:
                                theme.palette.mode === "dark"
                                    ? theme.palette.grey[800]
                                    : theme.palette.grey[100],
                        })}
                    >
                        <TableCell>ID</TableCell>
                        <TableCell>강의명</TableCell>
                        <TableCell>강사</TableCell>
                        <TableCell>카테고리</TableCell>
                        <TableCell>난이도</TableCell>
                        <TableCell>잔여 인원</TableCell>
                        <TableCell>수강 상태</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((it) => (
                        <CourseEnrolledRow
                            key={it.course_id}
                            item={it}
                            onCancel={onCancel}
                            difficultyMap={{ EASY: 1, MEDIUM: 2, HARD: 3 }}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
