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
 * 내 수강목록 테이블 한 줄
 * @param {object} item
 * @param {(id:number)=>void} onCancel
 * @param {object} difficultyMap
 */
export default function CourseEnrolledRow({ item, onCancel, difficultyMap }) {
    const navigate = useNavigate();
    return (
        <TableRow hover>
            <TableCell>{item.course_id}</TableCell>
            <TableCell>
                <Box
                    onClick={() =>
                        navigate(`/courses/${item.course_id}/classroom`)
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
                    <Typography variant="body2">{item.course_name}</Typography>
                </Box>
            </TableCell>
            <TableCell>{item.educator_name}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>
                <Rating
                    name={`rating-${item.course_id}`}
                    max={3}
                    value={difficultyMap[item.difficulty]}
                    readOnly
                    size="small"
                />
            </TableCell>
            <TableCell>
                <Chip
                    label={`${item.point} 학점`}
                    variant="outlined"
                    size="small"
                />
            </TableCell>
            <TableCell>
                <Chip
                    label={
                        item.status === "ENROLLED"
                            ? "수강 중"
                            : item.status === "COMPLETED"
                              ? "수강 완료"
                              : "수강 취소"
                    }
                    size="small"
                    sx={{
                        bgcolor:
                            item.status === "ENROLLED" ? "#BFECFF" : "#F8D7DA",
                        color:
                            item.status === "ENROLLED" ? "#005F8A" : "#721C24",
                        fontWeight: 500,
                    }}
                />
            </TableCell>
            <TableCell align="right">
                {item.status === "ENROLLED" && (
                    <IconButton
                        size="medium"
                        color="error"
                        onClick={() => onCancel(item.course_id)}
                    >
                        <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                )}
            </TableCell>
        </TableRow>
    );
}
