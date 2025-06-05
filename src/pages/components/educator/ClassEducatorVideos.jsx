import { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    Button,
    useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getLectureListAPI } from "../../../api/lecture";

export default function ClassEducatorVideos() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { courseId } = useParams();

    // 영상 목록 (메타정보 포함)
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const lectureList = await getLectureListAPI(Number(courseId));

                // LectureDTO 배열을 컴포넌트에서 사용할 형태로 변환
                const formatted = lectureList.map((lec) => ({
                    id: lec.lecture_id.toString(),
                    title: lec.title,
                    videoUrl: lec.video_url,
                    duration: "",
                    publishedAt: "",
                }));
                setVideos(formatted);
            } catch (err) {
                console.error("강사용 강의 영상 목록 조회 실패", err);
            }
        })();
    }, [courseId]);

    // 영상 메타 정보 조회 (YouTube Data API)
    useEffect(() => {
        if (!videos.length) return;

        const fetchMetaData = async () => {
            const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

            const updatedVideos = await Promise.all(
                videos.map(async (video) => {
                    let videoId = null;
                    try {
                        const parsed = new URL(video.videoUrl);
                        // 1) youtube.com/watch?v=… 형태
                        videoId = parsed.searchParams.get("v");
                        // 2) youtu.be 단축 URL (경로에 ID가 들어 있음)
                        if (!videoId && parsed.hostname.includes("youtu.be")) {
                            videoId = parsed.pathname.slice(1);
                        }
                    } catch {
                        videoId = null;
                    }

                    if (!videoId) return video;

                    try {
                        const response = await fetch(
                            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${API_KEY}`
                        );
                        const data = await response.json();
                        if (data.items && data.items.length > 0) {
                            const item = data.items[0];
                            return {
                                ...video,
                                duration: item.contentDetails.duration,
                                publishedAt: item.snippet.publishedAt,
                            };
                        }
                        return video;
                    } catch {
                        return video;
                    }
                })
            );

            setVideos(updatedVideos);
        };

        fetchMetaData();
    }, [videos.length]);

    // ISO 8601 형식의 길이를 "MM:SS" 또는 "H시간 MM:SS"로 변환
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

    // ISO 문자열을 "YYYY.MM.DD"로 변환
    const formatDate = (isoString) => {
        if (!isoString) return "-";
        const date = new Date(isoString);
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, "0");
        const d = date.getDate().toString().padStart(2, "0");
        return `${y}.${m}.${d}`;
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography
                variant="subtitle1"
                sx={{ mb: 2, color: theme.palette.text.secondary }}
            >
                총 강의 영상 수: <strong>{videos.length}개</strong>
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List>
                {videos.map((video, idx) => (
                    <Paper
                        key={video.id || idx}
                        elevation={3}
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                            bgcolor: theme.palette.background.default,
                        }}
                    >
                        <ListItem
                            alignItems="flex-start"
                            sx={{
                                py: 2,
                                px: 2,
                            }}
                        >
                            <ListItemText
                                disableTypography
                                primary={
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                            color: theme.palette.text.primary,
                                        }}
                                    >
                                        {idx + 1}. {video.title}
                                    </Typography>
                                }
                                secondary={
                                    <Box sx={{ mt: 1 }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 0.5 }}
                                        >
                                            URL:{" "}
                                            <a
                                                href={video.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    textDecoration: "underline",
                                                    color: theme.palette.primary
                                                        .main,
                                                }}
                                            >
                                                {video.videoUrl}
                                            </a>
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            길이:{" "}
                                            {formatDuration(video.duration)} |
                                            등록일:{" "}
                                            {formatDate(video.publishedAt)}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItem>
                    </Paper>
                ))}
            </List>

            <Box textAlign="center" sx={{ mt: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() =>
                        navigate("edit", {
                            state: { videos },
                        })
                    }
                >
                    영상 수정
                </Button>
            </Box>
        </Paper>
    );
}
