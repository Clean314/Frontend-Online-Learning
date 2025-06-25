import {
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";

/**
 * 진위형 문제 상세 보기 컴포넌트
 *
 * @param {Object} props
 * @param {"true"|"false"} props.answer - 정답 값
 */
export default function TrueFalseDetail({ answer }) {
    return (
        <Box>
            <Typography variant="subtitle1" mb={1}>
                정답
            </Typography>
            <RadioGroup value={answer}>
                <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="O"
                    disabled
                />
                <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="X"
                    disabled
                />
            </RadioGroup>
        </Box>
    );
}
