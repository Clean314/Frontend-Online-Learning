import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";
import CourseListRow from "./CourseListRow";

/**
 * 강의 목록 테이블 전체
 * @param {array} courses
 * @param {object} difficultyMap
 */
export default function CourseListTable({ courses, difficultyMap }) {
    return (
        <TableContainer sx={{ tableLayout: "fixed", width: "100%" }}>
            <Table>
                <colgroup>
                    <col style={{ width: "7%" }} />
                    <col style={{ width: "30%" }} />
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
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
                        <TableCell align="center">난이도</TableCell>
                        <TableCell align="center">학점</TableCell>
                        <TableCell align="center">최대인원</TableCell>
                        <TableCell align="center">여석</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courses.map((c) => (
                        <CourseListRow
                            key={c.course_id}
                            course={c}
                            difficultyMap={difficultyMap}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
