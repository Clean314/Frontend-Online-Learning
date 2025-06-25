import { TextField } from "@mui/material";

/**
 * 문제 내용 입력 필드
 *
 * @param {Object} props
 * @param {string} props.value - 입력된 문제 내용
 * @param {(value: string) => void} props.onChange - 내용 변경 핸들러
 */
export default function QuestionContentField({ value, onChange }) {
    return (
        <TextField
            label="문제 내용"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            multiline
            rows={4}
            fullWidth
            sx={{ mb: 2 }}
        />
    );
}
