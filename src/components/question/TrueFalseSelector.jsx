import {
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";

/**
 * 진위형 문제 정답 선택 컴포넌트
 *
 * @param {Object} props
 * @param {number | null} props.answerIndex - 선택된 정답 인덱스 (0: true, 1: false)
 * @param {(index: number) => void} props.setAnswerIndex - 정답 인덱스 설정 함수
 */
export default function TrueFalseSelector({ answerIndex, setAnswerIndex }) {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" mb={1}>
                정답 선택
            </Typography>
            <RadioGroup
                value={
                    answerIndex === 0
                        ? "true"
                        : answerIndex === 1
                          ? "false"
                          : ""
                }
                onChange={(e) =>
                    setAnswerIndex(e.target.value === "true" ? 0 : 1)
                }
            >
                <FormControlLabel value="true" control={<Radio />} label="O" />
                <FormControlLabel value="false" control={<Radio />} label="X" />
            </RadioGroup>
        </Box>
    );
}
