import {
    TableRow,
    TableCell,
    Box,
    Typography,
    Rating,
    Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * 강의 목록 테이블 한 줄
 * @param {object} course
 * @param {object} difficultyMap
 */
export default function CourseListRow({ course, difficultyMap }) {
    const navigate = useNavigate();
    return (
        <TableRow hover>
            <TableCell>{course.course_id}</TableCell>
            <TableCell>
                <Box
                    onClick={() =>
                        navigate(`${course.course_id}`, {
                            state: { courseData: course },
                        })
                    }
                    sx={{
                        display: "inline-block",
                        width: "100%",
                        transition: "all .15s",
                        "&:hover": {
                            transform: "scale(1.1)",
                            color: "#B1AFFF",
                            fontWeight: 600,
                        },
                        cursor: "pointer",
                    }}
                >
                    <Typography variant="body2">
                        {course.course_name}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell>{course.educator_name}</TableCell>
            <TableCell>{course.category}</TableCell>
            <TableCell align="center">
                <Rating
                    value={difficultyMap[course.difficulty]}
                    readOnly
                    size="small"
                />
            </TableCell>
            <TableCell align="center">
                <Chip
                    label={`${course.point} 학점`}
                    variant="outlined"
                    size="small"
                />
            </TableCell>
            <TableCell align="center">{course.max_enrollment}</TableCell>
            <TableCell align="center">{course.available_enrollment}</TableCell>
        </TableRow>
    );
}
