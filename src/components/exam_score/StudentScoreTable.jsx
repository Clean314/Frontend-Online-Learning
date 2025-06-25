import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
} from "@mui/material";

/**
 * 학생 성적 테이블
 *
 * @param {Object} props
 * @param {Array} props.scores - 학생 점수 목록
 * @param {Function} props.onViewDetail - 상세보기 클릭 핸들러 (studentId, item 전달됨)
 */
export default function StudentScoreTable({ scores, onViewDetail }) {
    return (
        <TableContainer>
            <Table>
                <colgroup>
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "25%" }} />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>학생 이름</TableCell>
                        <TableCell align="center">점수</TableCell>
                        <TableCell align="center">작업</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {scores.map((item) => (
                        <TableRow key={item.studentId}>
                            <TableCell>{item.studentId}</TableCell>
                            <TableCell>{item.studentName}</TableCell>
                            <TableCell align="center">
                                {item.submitted
                                    ? `${item.totalScore}점`
                                    : "미응시"}
                            </TableCell>
                            <TableCell align="center">
                                {item.submitted ? (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() =>
                                            onViewDetail(item.studentId, item)
                                        }
                                    >
                                        상세보기
                                    </Button>
                                ) : (
                                    "-"
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {scores.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                응시자가 없습니다.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
