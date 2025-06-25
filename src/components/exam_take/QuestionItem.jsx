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
 * @param {any} props.answer - 현재 선택된 답변 (인덱스)
 * @param {Function} props.onAnswerChange - 답변 선택 핸들러 (questionId, value)
 */
export default function QuestionItem({
    question,
    index,
    answer,
    onAnswerChange,
}) {
    const getChoiceLabel = (questionType, choice) => {
        if (questionType === "TRUE_FALSE") {
            if (choice === "true") return "O";
            if (choice === "false") return "X";
        }
        return choice;
    };

    return (
        <Box key={question.id} mb={4}>
            <Typography variant="subtitle1" mb={1}>
                {`문제 ${index + 1} (배점 ${question.score}점)`}
            </Typography>
            <Typography variant="body1" mb={2}>
                {question.content}
            </Typography>

            <RadioGroup
                name={`question-${question.id}`}
                value={answer}
                onChange={(e) =>
                    onAnswerChange(question.id, Number(e.target.value))
                }
            >
                {question.choices.map((choice, idx) => (
                    <FormControlLabel
                        key={idx}
                        value={idx}
                        control={<Radio />}
                        label={getChoiceLabel(question.questionType, choice)}
                    />
                ))}
            </RadioGroup>
        </Box>
    );
}
