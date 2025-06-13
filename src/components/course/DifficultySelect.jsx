import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DIFFICULTY_OPTIONS } from "../../constants/courseOptions";

/**
 * 난이도 필드
 * @param value -- 현재 선택된 “난이도”
 * @param onChange -- 사용자가 선택을 변경할 때 호출되는 이벤트 핸들러
 */
export default function DifficultySelect({ value, onChange }) {
    return (
        <FormControl fullWidth required>
            <InputLabel>난이도</InputLabel>
            <Select
                label="난이도"
                name="difficulty"
                value={value}
                onChange={onChange}
            >
                {DIFFICULTY_OPTIONS.map((level) => (
                    <MenuItem key={level} value={level}>
                        {level}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
