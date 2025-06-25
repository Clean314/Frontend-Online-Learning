import { TextField } from "@mui/material";

/**
 * 읽기 전용 텍스트 필드 컴포넌트
 *
 * @param {Object} props
 * @param {string} props.label - 필드 라벨
 * @param {string} props.value - 표시할 값
 * @param {boolean} [props.multiline] - 여러 줄 여부
 */
export default function ReadOnlyTextField({ label, value, multiline = false }) {
    return (
        <TextField
            label={label}
            value={value}
            fullWidth
            multiline={multiline}
            rows={multiline ? 4 : undefined}
            slotProps={{ input: { readOnly: true } }}
        />
    );
}
