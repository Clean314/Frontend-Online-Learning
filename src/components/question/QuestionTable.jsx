import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    IconButton,
    Tooltip,
    Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * 시험 문제 목록 테이블 컴포넌트
 *
 * @param {Object} props
 * @param {Object[]} props.questions - 문제 목록 배열
 * @param {Object} props.exam - 시험 정보 객체
 * @param {string} props.examStatus - 시험 상태 ("PREPARING" 등)
 * @param {(questionId: number) => void} props.onDelete - 문제 삭제 핸들러
 * @param {(path: string, state?: any) => void} props.navigate - 페이지 이동 함수
 */
export default function QuestionTable({
    questions,
    exam,
    examStatus,
    onDelete,
    navigate,
}) {
    const getTypeChipProps = (type) => {
        switch (type) {
            case "CHOICE":
                return {
                    label: "선다형",
                    sx: {
                        bgcolor: "#BFECFF",
                        color: "#005F8A",
                        fontWeight: 500,
                    },
                };
            case "TRUE_FALSE":
                return {
                    label: "진위형",
                    sx: {
                        bgcolor: "#FFF6E3",
                        color: "#7A6000",
                        fontWeight: 500,
                    },
                };
            default:
                return { label: type, sx: {} };
        }
    };

    const getAnswerDisplay = (question) => {
        if (question.question_type === "CHOICE") {
            const index = question.choices?.indexOf(question.answer);
            return index !== -1 ? `${index + 1}번` : "-";
        }
        if (question.question_type === "TRUE_FALSE") {
            const ans = String(question.answer).toLowerCase();
            return ans === "true" ? "O" : ans === "false" ? "X" : "-";
        }
        return "-";
    };

    return (
        <TableContainer>
            <Table>
                <colgroup>
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "7%" }} />
                    <col style={{ width: "7%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "12%" }} />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>문제 내용</TableCell>
                        <TableCell align="center">유형</TableCell>
                        <TableCell align="center">배점</TableCell>
                        <TableCell align="center">선택지 수</TableCell>
                        <TableCell align="center">정답</TableCell>
                        <TableCell align="center">작업</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {questions.map((question, idx) => (
                        <TableRow key={question.id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{question.content}</TableCell>
                            <TableCell align="center">
                                <Chip
                                    {...getTypeChipProps(
                                        question.question_type
                                    )}
                                    size="medium"
                                />
                            </TableCell>
                            <TableCell align="center">
                                {question.score}
                            </TableCell>
                            <TableCell align="center">
                                {question.question_type === "CHOICE"
                                    ? question.choices.length
                                    : "-"}
                            </TableCell>
                            <TableCell align="center">
                                {getAnswerDisplay(question)}
                            </TableCell>
                            <TableCell align="center">
                                {examStatus !== "PREPARING" ? (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() =>
                                            navigate(`${question.id}/detail`, {
                                                state: { exam, question },
                                            })
                                        }
                                    >
                                        자세히
                                    </Button>
                                ) : (
                                    <>
                                        <Tooltip title="수정">
                                            <IconButton
                                                color="info"
                                                onClick={() =>
                                                    navigate(
                                                        `${question.id}/edit`,
                                                        {
                                                            state: {
                                                                exam,
                                                                question,
                                                            },
                                                        }
                                                    )
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="삭제">
                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    onDelete(question.id)
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {questions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                등록된 문제가 없습니다.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
