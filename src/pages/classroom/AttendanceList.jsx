import { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getCourseAttendanceListAPI } from "../../api/lectureHistory";
import AttendanceTable from "../../components/attendance/AttendanceTable";

export default function AttendanceList() {
    const { courseId } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const data = await getCourseAttendanceListAPI(Number(courseId));
                setAttendance(data);
            } catch (err) {
                console.error("출석 정보 조회 실패:", err);
                setError("출석 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, [courseId]);

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" py={10}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <AttendanceTable attendance={attendance} />
            </Paper>
        </Container>
    );
}
