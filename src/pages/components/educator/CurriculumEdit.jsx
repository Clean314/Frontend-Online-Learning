import { useState, useEffect } from "react";
import {
    Navigate,
    useNavigate,
    useParams,
    useLocation,
} from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    IconButton,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { deleteLectureAPI, updateLectureAPI } from "../../../api/lecture";

export default function CurriculumEdit() {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const location = useLocation();
    const { pathname } = location;

    // 부모로부터 전달된 videos (state.videos) 가져오기
    const incomingVideos = location.state?.videos || [];

    // video 객체를 lecture 형태로 변환
    const [lectures, setLectures] = useState([
        { id: null, title: "", videoUrl: "" },
    ]);

    useEffect(() => {
        // courseId가 없으면 목록 화면으로 리다이렉트
        if (!courseId) return;

        if (incomingVideos.length > 0) {
            const mapped = incomingVideos.map((vid) => ({
                id: vid.id || null,
                title: vid.title || "",
                videoUrl: vid.videoUrl || "",
            }));
            setLectures(mapped);
        } else {
            // 전달된 videos가 없으면 기본으로 한 줄만 남겨놓기
            setLectures([{ id: null, title: "", videoUrl: "" }]);
        }
    }, [courseId, incomingVideos]);

    // 만약 courseId가 없으면 강의 목록 페이지로 리다이렉트
    if (!courseId) {
        return <Navigate to="/teach/courses/my" replace />;
    }

    // 입력값 변경 핸들러
    const handleLectureChange = (index, key) => (e) => {
        const value = e.target.value;

        setLectures((prev) => {
            const list = [...prev];

            list[index] = {
                ...list[index],
                [key]: value,
            };

            return list;
        });
    };

    // 강의 추가
    const addLecture = () => {
        setLectures((prev) => [...prev, { id: null, title: "", videoUrl: "" }]);
    };

    // 특정 강의 삭제 (삭제 API 호출 후 상태 갱신)
    const removeLecture = (index) => async () => {
        const lecToRemove = lectures[index];
        if (lectures.length === 1) return;

        // 이미 DB에 저장된 강의일 경우 deleteLectureAPI 호출
        if (lecToRemove.id) {
            try {
                await deleteLectureAPI(Number(courseId), lecToRemove.id);
            } catch (err) {
                console.error("강의 영상 삭제 실패:", err);
                alert("삭제 중 오류가 발생했습니다.");
                return;
            }
        }

        // 로컬 상태에서 해당 인덱스 제거
        setLectures((prev) => prev.filter((_, i) => i !== index));
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        const lecturesData = lectures.map((lec) => ({
            lecture_id: lec.id,
            title: lec.title,
            videoUrl: lec.videoUrl,
        }));

        try {
            await updateLectureAPI(Number(courseId), lecturesData);

            alert("커리큘럼이 수정되었습니다.");

            if (
                pathname.startsWith(
                    `/courses/${courseId}/classroom/teach/videos/edit`
                )
            ) {
                navigate(`/courses/${courseId}/classroom/teach/videos`);
            }
            // 그 외
            else {
                navigate(`/courses/${courseId}`);
            }
        } catch (err) {
            console.error("커리큘럼 수정 실패:", err);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                커리큘럼 수정
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ maxWidth: 800, mx: "auto", p: 1 }}
            >
                {lectures.map((lec, idx) => (
                    <Box
                        key={idx}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mb={2}
                    >
                        <Typography sx={{ width: 24, textAlign: "center" }}>
                            {idx + 1}.
                        </Typography>

                        <TextField
                            label="강의 제목"
                            value={lec.title}
                            onChange={handleLectureChange(idx, "title")}
                            fullWidth
                            required
                        />
                        <TextField
                            label="영상 URL"
                            value={lec.videoUrl}
                            onChange={handleLectureChange(idx, "videoUrl")}
                            fullWidth
                            required
                        />
                        <IconButton
                            onClick={removeLecture(idx)}
                            disabled={lectures.length === 1}
                        >
                            <RemoveIcon />
                        </IconButton>
                    </Box>
                ))}

                <Button
                    startIcon={<AddIcon />}
                    onClick={addLecture}
                    sx={{ mb: 3 }}
                >
                    강의 추가
                </Button>

                <Box textAlign="center">
                    <Button type="submit" variant="contained" size="large">
                        등록하기
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}
