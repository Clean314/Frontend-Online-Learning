import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    IconButton,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";

export default function CurriculumEdit() {
    const navigate = useNavigate();
    const { courseId } = useParams();

    // 강의 영상 리스트 상태
    const [lectures, setLectures] = useState([
        { id: null, title: "", videoUrl: "", file: null },
    ]);

    // 기존 커리큘럼 불러오기
    useEffect(() => {
        (async () => {
            try {
                // TODO: getCurriculumAPI(courseId) 호출해서 기존 목록 받아오기
            } catch (err) {
                console.error("커리큘럼 조회 실패:", err);
                alert("커리큘럼을 불러오는 데 실패했습니다.");
            }
        })();
    }, [courseId]);

    if (!courseId) {
        return <Navigate to="/teach/courses/my" replace />;
    }

    // 입력값 변경 핸들러
    const handleLectureChange = (index, key) => (e) => {
        const value = key === "file" ? e.target.files[0] : e.target.value;
        setLectures((prev) => {
            const list = [...prev];
            list[index] = { ...list[index], [key]: value };
            return list;
        });
    };

    // 강의 영상 추가
    const addLecture = () => {
        setLectures((prev) => [
            ...prev,
            { id: null, title: "", videoUrl: "", file: null },
        ]);
    };

    // 특정 강의 영상 삭제
    const removeLecture = (index) => () => {
        if (lectures.length === 1) return;
        setLectures((prev) => prev.filter((_, i) => i !== index));
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        lectures.forEach((lec, idx) => {
            if (lec.id != null) {
                formData.append(`lectures[${idx}].id`, lec.id);
            }
            formData.append(`lectures[${idx}].title`, lec.title);
            formData.append(`lectures[${idx}].videoUrl`, lec.videoUrl);
            if (lec.file) {
                formData.append(`lectures[${idx}].file`, lec.file);
            }
        });

        try {
            // TODO: updateCurriculumAPI(courseId, formData) 호출해서 수정 반영

            alert("커리큘럼이 수정되었습니다.");
            navigate(`/courses/${courseId}`);
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
                sx={{ maxWidth: 800, mx: "auto", p: 3 }}
            >
                {lectures.map((lec, idx) => (
                    <Box
                        key={idx}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mb={2}
                    >
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
                        {/* 파일 교체가 필요한 경우에만 활성화 */}
                        <Button variant="outlined" component="label">
                            파일 교체
                            <input
                                type="file"
                                hidden
                                onChange={handleLectureChange(idx, "file")}
                            />
                        </Button>
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
