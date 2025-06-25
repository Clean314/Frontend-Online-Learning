import {
    Typography,
    Paper,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";

/**
 * 문제 하나에 대한 채점 결과 카드
 *
 * @param {Object} props
 * @param {number} props.index - 문제 순서
 * @param {Object} props.question - 문제 정보
 * @param {Object} props.answer - 제출 답안 정보
 */
export default function StudentAnswerCard({ index, question, answer }) {
    if (!question || !answer) return null;

    const isTrueFalse = question.question_type === "TRUE_FALSE";

    const choices = isTrueFalse
        ? { 0: "O", 1: "X" }
        : question.choices?.reduce((obj, choice, idx) => {
              obj[String(idx)] = choice;
              return obj;
          }, {}) || {};

    const correctIndex = String(
        question.choices.findIndex((choice) => choice === question.answer)
    );

    const selected = String(answer.answer);

    return (
        <Paper
            sx={{
                p: 2,
                mb: 2,
                bgcolor: answer.correct ? "#E8F9FF" : "#FFEDF3",
            }}
        >
            <Typography variant="subtitle2" gutterBottom>
                {`문제 ${index + 1} (${question.question_type === "CHOICE" ? "선다형" : "진위형"} / 배점 ${question.score}점)`}
            </Typography>
            <Typography variant="body2" mb={1}>
                {question.content}
            </Typography>
            <RadioGroup value={selected}>
                {Object.entries(choices).map(([key, label]) => {
                    const isCorrectChoice = key === correctIndex;
                    return (
                        <FormControlLabel
                            key={key}
                            value={String(key)}
                            control={
                                <Radio
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                />
                            }
                            label={`${label}${isCorrectChoice ? " (정답)" : ""}`}
                            slotProps={{
                                label: {
                                    sx: {
                                        fontWeight: isCorrectChoice
                                            ? "bold"
                                            : "normal",
                                    },
                                },
                            }}
                        />
                    );
                })}
            </RadioGroup>
            <Typography
                variant="body2"
                color={answer.correct ? "#4DA8DA" : "error"}
            >
                {answer.correct ? "정답입니다." : "틀렸습니다."}
            </Typography>
        </Paper>
    );
}
