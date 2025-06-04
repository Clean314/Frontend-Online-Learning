import { TextField } from "@mui/material";

/**
 * 최대 수강 인원 필드 (10~100명)
 * @param value -- 현재 입력된 “최대 수강 인원”
 * @param onChange -- 사용자가 숫자 입력란을 변경할 때마다 호출되는 이벤트 핸들러
 */
export default function MaxEnrollmentField({ value, onChange }) {
    return (
        <TextField
            label="최대 수강 인원"
            name="max_enrollment"
            type="number"
            value={value}
            onChange={onChange}
            fullWidth
            required
            slotProps={{
                htmlInput: { min: 10, max: 100 },
            }}
            helperText="최소 10명, 최대 100명까지 입력 가능합니다."
        />
    );
}
