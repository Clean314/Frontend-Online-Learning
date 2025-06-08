import {
    TableRow,
    TableCell,
    Box,
    Typography,
    Rating,
    Chip,
    IconButton,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useNavigate } from "react-router-dom";

/**
 * 한 강의(row) 렌더링
 * @param {object} course -- course_id, course_name, category, difficulty, point, max_enrollment, available_enrollment 포함
 * @param {function} onDelete -- 삭제 요청 핸들러 (course 객체를 인자로 받음)
 */
export default function CourseRow({ course, onDelete }) {
    const navigate = useNavigate();
    return (
        <TableRow hover>
            <TableCell>{course.course_id}</TableCell>
            <TableCell>
                <Box
                    onClick={() =>
                        navigate(`/courses/${course.course_id}/classroom`)
                    }
                    sx={{
                        display: "inline-block",
                        width: "100%",
                        transition: "all 0.15s ease-in-out",
                        "&:hover": {
                            transform: "scale(1.1)",
                            color: "#B1AFFF",
                            fontWeight: 600,
                        },
                        cursor: "pointer",
                        verticalAlign: "middle",
                    }}
                >
                    <Typography variant="body2">
                        {course.course_name}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell>{course.category}</TableCell>
            <TableCell align="center">
                <Rating
                    name="difficulty"
                    max={3}
                    value={{ EASY: 1, MEDIUM: 2, HARD: 3 }[course.difficulty]}
                    readOnly
                    size="small"
                />
            </TableCell>
            <TableCell align="center">
                <Chip label={`${course.point} 학점`} variant="outlined" />
            </TableCell>
            <TableCell align="center">{course.max_enrollment}</TableCell>
            <TableCell align="center">
                {course.max_enrollment - course.available_enrollment}
            </TableCell>
            <TableCell align="center">{course.available_enrollment}</TableCell>
            <TableCell>
                <IconButton
                    size="medium"
                    color="error"
                    title="강의 삭제"
                    onClick={() => onDelete(course)}
                >
                    <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}
