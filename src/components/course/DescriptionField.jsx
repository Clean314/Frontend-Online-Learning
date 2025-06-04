import { TextField } from "@mui/material";

/**
 * 상세 설명 필드
 * @param value -- 현재 입력된 “상세 설명” 텍스트
 * @param onChange -- 사용자가 멀티라인 입력창에 값을 입력할 때마다 호출되는 이벤트 핸들러
 */
export default function DescriptionField({ value, onChange }) {
    return (
        <TextField
            label="상세 설명"
            name="description"
            value={value}
            onChange={onChange}
            multiline
            rows={7}
            fullWidth
        />
    );
}
