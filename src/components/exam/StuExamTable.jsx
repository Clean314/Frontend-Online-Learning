import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import StuExamTableRow from "./StuExamTableRow";

/**
 * 시험 목록 전체 테이블 컴포넌트
 *
 * @param {Object} props
 * @param {Array} props.exams - 시험 목록 배열
 * @param {Function} props.onTakeExam - 시험 응시 버튼 클릭 시 호출되는 함수
 */
export default function StuExamTable({ exams, onTakeExam }) {
    return (
        <TableContainer>
            <Table>
                <colgroup>
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "5%" }} />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>제목</TableCell>
                        <TableCell>시작</TableCell>
                        <TableCell>종료</TableCell>
                        <TableCell>상태</TableCell>
                        <TableCell>응시 여부</TableCell>
                        <TableCell align="center">내 점수</TableCell>
                        <TableCell align="center">총점</TableCell>
                        <TableCell align="center">문항 수</TableCell>
                        <TableCell align="center">작업</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {exams.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} align="center">
                                등록된 시험이 없습니다.
                            </TableCell>
                        </TableRow>
                    ) : (
                        exams.map((exam) => (
                            <StuExamTableRow
                                key={exam.id}
                                exam={exam}
                                onTakeExam={onTakeExam}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
