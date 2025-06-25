import { Box, Typography, Radio, TextField } from "@mui/material";

/**
 * 선다형 문제 상세 보기 컴포넌트
 *
 * @param {Object} props
 * @param {string[]} props.choices - 선택지 배열
 * @param {number|null} props.answerIndex - 정답 인덱스
 */
export default function ChoiceDetail({ choices, answerIndex }) {
    const getAnswerDisplay = () =>
        answerIndex != null ? `${answerIndex + 1}번` : "-";

    return (
        <Box>
            <Typography variant="subtitle1" mb={1}>
                선택지
            </Typography>
            {choices.map((choice, idx) => (
                <Box key={idx} display="flex" alignItems="center" mb={1}>
                    <Radio checked={answerIndex === idx} disabled />
                    <TextField
                        value={choice}
                        fullWidth
                        slotProps={{ input: { readOnly: true } }}
                    />
                </Box>
            ))}
            <Typography variant="body2" mt={1}>
                <strong>정답 번호:</strong> {getAnswerDisplay()}
            </Typography>
        </Box>
    );
}
