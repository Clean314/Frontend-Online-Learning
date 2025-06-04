import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { credits } from "../../constants/courseOptions";

/**
 * 학점 필드
 * @param value -- 현재 선택된 “학점”
 * @param onChange -- 사용자가 선택을 변경할 때 호출되는 이벤트 핸들러
 */
export default function CreditSelect({ value, onChange }) {
    return (
        <FormControl fullWidth required>
            <InputLabel>학점</InputLabel>
            <Select label="학점" name="point" value={value} onChange={onChange}>
                {credits.map((c) => (
                    <MenuItem key={c} value={c}>
                        {c}학점
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
