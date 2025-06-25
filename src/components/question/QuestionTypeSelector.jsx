import { Box, TextField } from "@mui/material";

/**
 * 문제 유형 및 배점 선택 필드
 *
 * @param {Object} props
 * @param {string} props.type - 문제 유형 ("CHOICE" | "TRUE_FALSE")
 * @param {string} props.score - 배점
 * @param {(type: string) => void} props.onTypeChange - 유형 변경 핸들러
 * @param {(score: string) => void} props.onScoreChange - 배점 변경 핸들러
 * @param {() => void} props.resetChoices - 유형 변경 시 선택지 초기화 함수
 */
export default function QuestionTypeSelector({
    type,
    score,
    onTypeChange,
    onScoreChange,
    resetChoices,
}) {
    return (
        <Box display="flex" gap={2} sx={{ mb: 2 }}>
            <TextField
                select
                label="문제 유형"
                value={type}
                onChange={(e) => {
                    onTypeChange(e.target.value);
                    resetChoices();
                }}
                slotProps={{ select: { native: true } }}
                fullWidth
            >
                <option value="CHOICE">선다형</option>
                <option value="TRUE_FALSE">진위형</option>
            </TextField>

            <TextField
                label="배점"
                type="number"
                inputProps={{ min: 0, max: 100, step: 1 }}
                value={score}
                onChange={(e) => onScoreChange(e.target.value)}
                fullWidth
            />
        </Box>
    );
}
