import { TableRow, TableCell, IconButton, Tooltip } from "@mui/material";
import { PlayArrow as PlayArrowIcon } from "@mui/icons-material";
import { StatusChip, TakenChip } from "./StatusChip";

/**
 * 시험 목록 테이블의 개별 행 컴포넌트
 *
 * @param {Object} props
 * @param {Object} props.exam - 시험 정보 객체
 * @param {Function} props.onTakeExam - 시험 응시 버튼 클릭 시 호출되는 함수
 */
export default function StuExamTableRow({ exam, onTakeExam }) {
    return (
        <TableRow>
            <TableCell>{exam.title}</TableCell>
            <TableCell>{exam.startTime.toLocaleString()}</TableCell>
            <TableCell>{exam.endTime.toLocaleString()}</TableCell>
            <TableCell>
                <StatusChip status={exam.status} />
            </TableCell>
            <TableCell>
                <TakenChip hasTaken={exam.hasTaken} />
            </TableCell>
            <TableCell align="center">
                {exam.hasTaken
                    ? `${exam.score}점`
                    : exam.status === "COMPLETED"
                      ? "0점"
                      : "-"}
            </TableCell>
            <TableCell align="center">{`${exam.totalScore}점`}</TableCell>
            <TableCell align="center">{exam.questionCount}</TableCell>
            <TableCell align="center">
                {!exam.hasTaken && exam.status === "IN_PROGRESS" && (
                    <Tooltip title="응시하기">
                        <IconButton
                            color="primary"
                            onClick={() => onTakeExam(exam)}
                        >
                            <PlayArrowIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </TableCell>
        </TableRow>
    );
}
