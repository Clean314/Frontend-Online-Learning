import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";
import CourseRow from "./CourseRow";

/**
 * 강의 목록 테이블 전체
 * @param {array} courses -- 화면에 렌더할 course 배열
 * @param {function} onDelete -- 삭제 핸들러
 */
export default function CoursesTable({ courses, onDelete }) {
    return (
        <TableContainer sx={{ tableLayout: "fixed", width: "100%" }}>
            <Table>
                <colgroup>
                    <col style={{ width: "6%" }} />
                    <col style={{ width: "27%" }} />
                    <col style={{ width: "13%" }} />
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "10%" }} />
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
                        <TableCell>카테고리</TableCell>
                        <TableCell align="center">난이도</TableCell>
                        <TableCell align="center">학점</TableCell>
                        <TableCell align="center">최대인원</TableCell>
                        <TableCell align="center">수강인원</TableCell>
                        <TableCell align="center">여석</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courses.map((course) => (
                        <CourseRow
                            key={course.course_id}
                            course={course}
                            onDelete={onDelete}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
