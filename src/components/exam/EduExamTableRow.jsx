import { TableRow, TableCell, IconButton, Tooltip } from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    ListAlt as QuestionIcon,
    BarChart as BarChartIcon,
} from "@mui/icons-material";
import { StatusChip } from "./StatusChip";

/**
 * 강의자가 관리하는 시험의 테이블 행 컴포넌트
 *
 * @param {Object} props
 * @param {Object} props.exam - 시험 데이터
 * @param {Function} props.onDelete - 삭제 버튼 클릭 시 실행 함수
 * @param {Function} props.navigate - 라우팅을 위한 navigate 함수
 */
export default function EduExamTableRow({ exam, onDelete, navigate }) {
    return (
        <TableRow>
            <TableCell>{exam.title}</TableCell>
            <TableCell>{exam.description}</TableCell>
            <TableCell>{new Date(exam.start_time).toLocaleString()}</TableCell>
            <TableCell>{new Date(exam.end_time).toLocaleString()}</TableCell>
            <TableCell>
                <StatusChip status={exam.status} />
            </TableCell>
            <TableCell align="center">{exam.questionCount}</TableCell>
            <TableCell align="center">{exam.totalScore}점</TableCell>
            <TableCell align="center">
                <Tooltip title="문제 관리">
                    <IconButton
                        color="primary"
                        onClick={() =>
                            navigate(`${exam.id}/questions`, {
                                state: { exam },
                            })
                        }
                    >
                        <QuestionIcon />
                    </IconButton>
                </Tooltip>

                {exam.status === "PREPARING" && (
                    <>
                        <Tooltip title="수정">
                            <IconButton
                                color="info"
                                onClick={() =>
                                    navigate(`${exam.id}/edit`, {
                                        state: { exam },
                                    })
                                }
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="삭제">
                            <IconButton
                                color="error"
                                onClick={() => onDelete(exam.id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                )}

                {(exam.status === "IN_PROGRESS" ||
                    exam.status === "COMPLETED") && (
                    <Tooltip title="전체 응시자 성적 조회">
                        <IconButton
                            onClick={() =>
                                navigate(`${exam.id}/scores`, {
                                    state: { totalScore: exam.totalScore },
                                })
                            }
                        >
                            <BarChartIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </TableCell>
        </TableRow>
    );
}
