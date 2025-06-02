import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    useTheme,
    Divider,
    IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ClassStudentVideosWatch() {
    const theme = useTheme();
    const navigate = useNavigate();

    const location = useLocation();
    const video = location.state?.video;

    const { videoId } = useParams();

    // video 정보가 없으면 오류 메시지 출력
    if (!video) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" color="error">
                    영상 정보를 불러올 수 없습니다.
                </Typography>
            </Paper>
        );
    }

    // 전달받은 video.videoUrl에서 유튜브 embed URL 생성 함수
    const getEmbedUrl = (url) => {
        try {
            const parsed = new URL(url);
            let id = parsed.searchParams.get("v");
            if (!id && parsed.hostname.includes("youtu.be")) {
                id = parsed.pathname.slice(1);
            }
            if (id) return `https://www.youtube.com/embed/${id}`;
            return null;
        } catch {
            return null;
        }
    };

    const embedUrl = getEmbedUrl(video.videoUrl);

    return (
        <Box sx={{ p: 3 }}>
            {/* 제목 및 뒤로가기 버튼, 메타 정보 영역 */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                }}
            >
                {/* 좌측: 뒤로가기 버튼 + 제목 */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{ mr: 1 }}
                        size="small"
                    >
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Typography
                        variant="h5"
                        sx={{ color: theme.palette.text.primary }}
                    >
                        {video.title}
                    </Typography>
                </Box>

                {/* 우측: 메타 정보 */}
                <Typography variant="body2" color="text.secondary">
                    길이: {formatDuration(video.duration)} • 등록일:{" "}
                    {formatDate(video.publishedAt)}
                </Typography>
            </Box>

            {/* 제목 아래 구분선 */}
            <Divider sx={{ mb: 2 }} />

            {/* 유튜브 영상 임베드 */}
            {embedUrl ? (
                <Box
                    sx={{
                        position: "relative",
                        pb: "56.25%", // 16:9 비율 유지
                        height: 0,
                        mb: 2,
                    }}
                >
                    <iframe
                        title={video.title}
                        src={embedUrl}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: 0,
                        }}
                    />
                </Box>
            ) : (
                <Typography variant="body1" color="text.secondary">
                    올바른 유튜브 URL이 아닙니다.
                </Typography>
            )}
        </Box>
    );
}

// ClassStudentVideos와 동일한 형식으로 ISO 8601 → MM:SS 또는 H시간 MM:SS 변환
const formatDuration = (isoDuration) => {
    if (!isoDuration) return "-";
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "-";
    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);

    if (hours) {
        const mm = minutes.toString().padStart(2, "0");
        const ss = seconds.toString().padStart(2, "0");
        return `${hours}시간 ${mm}:${ss}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// ClassStudentVideos와 동일하게 ISO 문자열 → YYYY.MM.DD 변환
const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}.${m}.${d}`;
};
