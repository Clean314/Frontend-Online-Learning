import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    IconButton,
    Typography,
    Paper,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";

export default function CurriculumRegister() {
    const navigate = useNavigate();
    const { courseId } = useParams();

    // 강의 영상 리스트 상태
    const [lectures, setLectures] = useState([{ title: "", videoUrl: "" }]);

    if (!courseId) {
        return <Navigate to="/teach/courses/new" replace />;
    }

    // 입력값 변경 핸들러
    const handleLectureChange = (index, key) => (e) => {
        const value = key === "file" ? e.target.files[0] : e.target.value;
        const newList = [...lectures];
        newList[index][key] = value;
        setLectures(newList);
    };

    // 강의 영상 추가
    const addLecture = () => {
        setLectures([...lectures, { title: "", videoUrl: "", file: null }]);
    };

    // 특정 강의 영상 삭제
    const removeLecture = (index) => () => {
        if (lectures.length === 1) return;
        setLectures(lectures.filter((_, i) => i !== index));
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        lectures.forEach((lec, idx) => {
            formData.append(`lectures[${idx}].title`, lec.title);
            formData.append(`lectures[${idx}].videoUrl`, lec.videoUrl);
        });

        try {
            // TODO: 강의 영상 리스트 등록 API

            alert("커리큘럼이 등록되었습니다.");
            navigate(`/courses/${courseId}/classroom`);
        } catch (err) {
            console.error(err);
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                커리큘럼
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
                        <Typography
                            sx={{
                                width: 24,
                                textAlign: "center",
                                fontWeight: 500,
                            }}
                        >
                            {idx + 1}.
                        </Typography>
                        <TextField
                            label="강의 제목"
                            value={lec.title}
                            onChange={handleLectureChange(idx, "title")}
                            fullWidth
                        />
                        <TextField
                            label="영상 URL"
                            value={lec.videoUrl}
                            onChange={handleLectureChange(idx, "videoUrl")}
                            fullWidth
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
