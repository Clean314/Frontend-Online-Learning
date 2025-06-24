import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import EduExamTableRow from "./EduExamTableRow";

/**
 * 강의자용 시험 목록 테이블 컴포넌트
 *
 * @param {Object} props
 * @param {Array} props.exams - 시험 데이터 배열
 * @param {Function} props.onDelete - 삭제 함수
 * @param {Function} props.navigate - 라우팅 함수
 */
export default function EduExamTable({ exams, onDelete, navigate }) {
    return (
        <TableContainer>
            <Table>
                <colgroup>
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "13%" }} />
                    <col style={{ width: "13%" }} />
                    <col style={{ width: "7%" }} />
                    <col style={{ width: "9%" }} />
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "14%" }} />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>제목</TableCell>
                        <TableCell>설명</TableCell>
                        <TableCell>시작</TableCell>
                        <TableCell>종료</TableCell>
                        <TableCell>상태</TableCell>
                        <TableCell align="center">문제 수</TableCell>
                        <TableCell align="center">총점</TableCell>
                        <TableCell align="center">작업</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {exams.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                등록된 시험이 없습니다.
                            </TableCell>
                        </TableRow>
                    ) : (
                        exams.map((exam) => (
                            <EduExamTableRow
                                key={exam.id}
                                exam={exam}
                                onDelete={onDelete}
                                navigate={navigate}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
