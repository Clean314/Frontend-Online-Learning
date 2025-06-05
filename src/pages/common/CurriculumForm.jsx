// src/components/curriculum/CurriculumForm.jsx
import { useState, useEffect } from "react";
import { Box, Paper, Button, CircularProgress } from "@mui/material";
import {
    useNavigate,
    useParams,
    useLocation,
    Navigate,
} from "react-router-dom";
import {
    createLectureAPI,
    deleteLectureAPI,
    updateLectureAPI,
} from "../../api/lecture";

import CurriculumHeader from "../../components/curriculum/CurriculumHeader";
import LectureRow from "../../components/curriculum/LectureRow";
import AddLectureButton from "../../components/curriculum/AddLectureButton";

/**
 * 커리큘럼 등록 및 수정 폼
 */
export default function CurriculumForm() {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const location = useLocation();
    // location.state?.videos 가 없으면 undefined. 빈 배열을 새로 만들지 않도록 그대로 두기.
    const incomingVideos = location.state?.videos;

    const isEditMode =
        Array.isArray(incomingVideos) && incomingVideos.length > 0;

    // lectures 상태: { id: number|null, title: string, videoUrl: string } 객체 배열
    const [lectures, setLectures] = useState([
        { id: null, title: "", videoUrl: "" },
    ]);
    const [loading, setLoading] = useState(true);

    // 마운트 시 또는 courseId 혹은 isEditMode가 바뀔 때만 실행
    useEffect(() => {
        if (!courseId) return;

        if (isEditMode) {
            // 편집 모드: incomingVideos에 기반해 초기 lectures 설정
            const mapped = incomingVideos.map((vid) => ({
                id: vid.id || null,
                title: vid.title || "",
                videoUrl: vid.videoUrl || "",
            }));

            setLectures(
                mapped.length > 0
                    ? mapped
                    : [{ id: null, title: "", videoUrl: "" }]
            );
        } else {
            // 등록 모드: 기본 빈 강의 항목 하나
            setLectures([{ id: null, title: "", videoUrl: "" }]);
        }

        setLoading(false);
    }, [courseId, isEditMode, incomingVideos]);

    // courseId가 없으면 리다이렉트
    if (!courseId) {
        const redirectPath = isEditMode
            ? "/teach/courses/my"
            : "/teach/courses/new";
        return <Navigate to={redirectPath} replace />;
    }

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    // 개별 강의 입력값 변경 핸들러
    const handleLectureChange = (index, key) => (e) => {
        const value = e.target.value;
        setLectures((prev) => {
            const list = [...prev];
            list[index] = { ...list[index], [key]: value };
            return list;
        });
    };

    // 새로운 빈 강의 항목을 추가
    const addLecture = () => {
        setLectures((prev) => [...prev, { id: null, title: "", videoUrl: "" }]);
    };

    // 특정 강의 항목을 삭제
    const removeLecture = (index) => async () => {
        if (lectures.length === 1) return;

        const lec = lectures[index];

        if (isEditMode && lec.id) {
            try {
                await deleteLectureAPI(Number(courseId), lec.id);
            } catch (err) {
                console.error("강의 영상 삭제 실패:", err);
                alert("삭제 중 오류가 발생했습니다.");
                return;
            }
        }
        setLectures((prev) => prev.filter((_, i) => i !== index));
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 제목과 URL 둘 다 빈 문자열인 항목 필터링
        const filteredLectures = lectures.filter(
            (lec) => lec.title.trim() !== "" || lec.videoUrl.trim() !== ""
        );

        if (isEditMode) {
            // 수정 모드: lectures 배열을 백엔드 API 스펙에 맞게 바꿔서 전송
            const lecturesData = lectures.map((lec) => ({
                lecture_id: Number(lec.id) === 0 ? null : Number(lec.id),
                title: lec.title,
                video_url: lec.videoUrl,
            }));

            if (lecturesData.length === 0) {
                alert("변경할 강의가 없습니다.");
                return;
            }

            try {
                await updateLectureAPI(Number(courseId), lecturesData);

                alert("커리큘럼이 수정되었습니다.");
                const { pathname } = location;
                if (
                    pathname.startsWith(
                        `/courses/${courseId}/classroom/teach/videos/edit`
                    )
                ) {
                    navigate(`/courses/${courseId}/classroom/teach/videos`);
                } else {
                    navigate(`/courses/${courseId}`);
                }
            } catch (err) {
                console.error("강의 영상 수정 중 오류 발생", err);

                const msg =
                    err.response?.data?.message ??
                    err.response?.data ??
                    err.message;

                // msg가 문자열인지, 객체인지 확인 후 문자열로 변환
                const msgText =
                    typeof msg === "string" ? msg : JSON.stringify(msg);

                // "이미 등록된 강의 제목입니다."로 시작하면 제목 중복 오류
                if (msgText.includes("이미 등록된 강의 제목입니다")) {
                    alert(
                        "오류: 이미 등록된 강의 제목이 존재합니다.\n다른 제목을 입력해주세요."
                    );
                }
                // "이미 등록된 URL입니다."로 시작하면 URL 중복 오류
                else if (msgText.includes("이미 등록된 URL입니다")) {
                    alert(
                        "오류: 이미 등록된 영상 URL이 존재합니다.\n다른 URL을 입력해주세요."
                    );
                }
                // 그 외 기타 오류
                else {
                    alert("수정 중 오류가 발생했습니다.");
                }
            }
        } else {
            // 실제 입력된 데이터가 없으면 API 호출 없이 강의실로 이동
            if (filteredLectures.length === 0) {
                navigate(`/courses/${courseId}/classroom`);
                return;
            }

            // 입력된 데이터가 있으면 API에 넘길 형태(배열)로 매핑
            const lecturesData = filteredLectures.map((lec) => ({
                title: lec.title,
                video_url: lec.videoUrl, // 바뀐 필드명
            }));

            try {
                // createLectureAPI 호출 (배열 전체 전달)
                await createLectureAPI(Number(courseId), lecturesData);

                alert("커리큘럼이 등록되었습니다.");
                navigate(`/courses/${courseId}/classroom`);
            } catch (err) {
                console.error("강의 영상 등록 중 오류 발생", err);

                const msg =
                    err.response?.data?.message ||
                    err.response?.data ||
                    err.message;

                const msgText =
                    typeof msg === "string" ? msg : JSON.stringify(msg);

                if (msgText.includes("이미 등록된 강의 제목입니다")) {
                    alert(
                        "오류: 이미 등록된 강의 제목이 존재합니다.\n다른 제목을 입력해주세요."
                    );
                } else if (msgText.includes("이미 등록된 URL입니다")) {
                    alert(
                        "오류: 이미 등록된 영상 URL이 존재합니다.\n다른 URL을 입력해주세요."
                    );
                } else {
                    alert(err.response?.data || "등록 중 오류가 발생했습니다.");
                }
            }
        }
    };

    const buttonLabel = isEditMode ? "저장하기" : "등록하기";

    return (
        <Paper sx={{ p: 3 }}>
            <CurriculumHeader isEditMode={isEditMode} />
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ maxWidth: 800, mx: "auto", p: 1 }}
            >
                {lectures.map((lec, idx) => (
                    <LectureRow
                        key={idx}
                        index={idx}
                        lecture={lec}
                        onChange={handleLectureChange}
                        onRemove={removeLecture}
                        disableRemove={lectures.length === 1}
                    />
                ))}

                <AddLectureButton onClick={addLecture} />

                <Box textAlign="center">
                    <Button type="submit" variant="contained" size="large">
                        {buttonLabel}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}
