import {
    TableRow,
    TableCell,
    TextField,
    Select,
    MenuItem,
} from "@mui/material";
import {
    CATEGORY_OPTIONS,
    DIFFICULTY_OPTIONS,
    POINT_OPTIONS,
} from "../../../constants/courseOptions";
import ActionButtons from "../common/ActionButtons";

/**
 * 개별 강의 행 컴포넌트 (보기/편집 모드)
 * @param {Object} props
 * @param {Object} props.course - 강의 데이터 객체
 * @param {boolean} props.isEditing - 편집 모드 여부
 * @param {Object} props.editedData - 편집 중인 강의 데이터
 * @param {function} props.onEdit - 편집 시작 핸들러 (course 객체)
 * @param {function} props.onSave - 저장 핸들러 (id)
 * @param {function} props.onCancel - 편집 취소 핸들러
 * @param {function} props.onDelete - 삭제 핸들러 (id)
 * @param {function} props.onChange - 입력값 변경 핸들러 (e)
 */
export default function CourseRow({
    course,
    isEditing,
    editedData,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    onChange,
}) {
    return (
        <TableRow hover key={course.course_id}>
            <TableCell>{course.course_id}</TableCell>
            {isEditing ? (
                <>
                    <TableCell>
                        <TextField
                            name="course_name"
                            value={editedData.course_name}
                            onChange={onChange}
                            size="small"
                        />
                    </TableCell>
                    <TableCell>{course.educator_name}</TableCell>
                    <TableCell>
                        <Select
                            name="category"
                            value={editedData.category}
                            onChange={onChange}
                            size="small"
                        >
                            {CATEGORY_OPTIONS.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </TableCell>
                    <TableCell>
                        <Select
                            name="difficulty"
                            value={editedData.difficulty}
                            onChange={onChange}
                            size="small"
                        >
                            {DIFFICULTY_OPTIONS.map((d) => (
                                <MenuItem key={d} value={d}>
                                    {d}
                                </MenuItem>
                            ))}
                        </Select>
                    </TableCell>
                    <TableCell>
                        <Select
                            name="point"
                            value={editedData.point}
                            onChange={onChange}
                            size="small"
                        >
                            {POINT_OPTIONS.map((p) => (
                                <MenuItem key={p} value={p}>
                                    {p}
                                </MenuItem>
                            ))}
                        </Select>
                    </TableCell>
                    <TableCell>{course.max_enrollment}</TableCell>
                    <TableCell align="right">
                        <ActionButtons
                            isEditing
                            onSave={() => onSave(course.course_id)}
                            onCancel={onCancel}
                            id={course.course_id}
                        />
                    </TableCell>
                </>
            ) : (
                <>
                    <TableCell>{course.course_name}</TableCell>
                    <TableCell>{course.educator_name}</TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>{course.difficulty}</TableCell>
                    <TableCell>{course.point}</TableCell>
                    <TableCell>{course.max_enrollment}</TableCell>
                    <TableCell align="right">
                        <ActionButtons
                            isEditing={false}
                            onEdit={() => onEdit(course)}
                            onDelete={() => onDelete(course.course_id)}
                            id={course.course_id}
                        />
                    </TableCell>
                </>
            )}
        </TableRow>
    );
}
