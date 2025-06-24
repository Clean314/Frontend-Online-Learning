import { Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../common/BackButton";

/**
 * 시험 상단 헤더 컴포넌트
 *
 * @param {Object} props
 * @param {string} props.title - 시험 제목
 * @param {number} props.remainingTime - 남은 시간 (초 단위)
 */
export default function ExamHeader({ title, remainingTime }) {
    const navigate = useNavigate();
    const { courseId } = useParams();

    const formatTime = (sec) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${String(h).padStart(2, "0")}시간 ${String(m).padStart(2, "0")}분 ${String(s).padStart(2, "0")}초`;
    };

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
        >
            <Box display="flex" alignItems="center">
                <BackButton
                    onClick={() =>
                        navigate(`/courses/${courseId}/classroom/learn/exams`)
                    }
                />
                <Typography variant="h5">{title}</Typography>
            </Box>
            <Typography
                variant="h6"
                color={remainingTime <= 60 ? "error" : "text.primary"}
            >
                남은 시간: {formatTime(remainingTime)}
            </Typography>
        </Box>
    );
}
