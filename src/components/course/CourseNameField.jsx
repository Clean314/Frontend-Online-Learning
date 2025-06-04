import { TextField } from "@mui/material";

/**
 * 강의명 필드
 * @param value -- 현재 입력된 “강의명” 텍스트
 * @param onChange -- 사용자가 텍스트를 입력할 때마다 호출되는 이벤트 핸들러
 */
export default function CourseNameField({ value, onChange }) {
    return (
        <TextField
            label="강의명"
            name="course_name"
            value={value}
            onChange={onChange}
            fullWidth
            required
        />
    );
}
