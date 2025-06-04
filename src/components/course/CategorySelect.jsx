import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { categories } from "../../constants/courseOptions";

/**
 * 강의 카테고리 선택 필드
 * @param value -- 현재 선택된 "카테고리"
 * @param onChange -- 사용자가 선택을 변경할 때 호출되는 이벤트 핸들러
 */
export default function CategorySelect({ value, onChange }) {
    return (
        <FormControl sx={{ width: "auto", minWidth: 200 }} required>
            <InputLabel>카테고리</InputLabel>
            <Select
                label="카테고리"
                name="category"
                value={value}
                onChange={onChange}
            >
                {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                        {cat}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
