import {
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";

/**
 * 시험 문제 항목 컴포넌트
 *
 * @param {Object} props
 * @param {Object} props.question - 문제 객체
 * @param {number} props.index - 문제 번호 (0부터 시작)
 * @param {any} props.answer - 현재 선택된 답변
 * @param {Function} props.onAnswerChange - 답변 선택 핸들러 (questionId, value)
 */
export default function QuestionItem({
    question,
    index,
    answer,
    onAnswerChange,
}) {
    return (
        <Box key={question.id} mb={4}>
            <Typography variant="subtitle1" mb={1}>
                {`문제 ${index + 1} (배점 ${question.score}점)`}
            </Typography>
            <Typography variant="body1" mb={2}>
                {question.content}
            </Typography>

            {question.questionType === "CHOICE" ? (
                <RadioGroup
                    value={answer !== undefined ? String(answer) : ""}
                    onChange={(e) =>
                        onAnswerChange(question.id, Number(e.target.value))
                    }
                >
                    {question.choices.map((choice, i) => (
                        <FormControlLabel
                            key={i}
                            value={String(i)}
                            control={<Radio />}
                            label={choice}
                        />
                    ))}
                </RadioGroup>
            ) : (
                <RadioGroup
                    value={answer || ""}
                    onChange={(e) =>
                        onAnswerChange(question.id, Number(e.target.value))
                    }
                >
                    <FormControlLabel
                        value="TRUE"
                        control={<Radio />}
                        label="참"
                    />
                    <FormControlLabel
                        value="FALSE"
                        control={<Radio />}
                        label="거짓"
                    />
                </RadioGroup>
            )}
        </Box>
    );
}
