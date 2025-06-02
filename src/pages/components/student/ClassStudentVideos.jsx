import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ClassStudentVideos() {
    const theme = useTheme();
    const navigate = useNavigate();

    // 영상 목록 (메타정보 포함)
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        // TODO: 강의 영상 목록 조회 API 연동
        const tempData = [
            {
                id: "1",
                title: "봄 스케치, 하늘, 구름",
                videoUrl: "https://youtu.be/44wq3kI02pM?si=Vk6IzNkhsjh9u-kx",
                duration: "",
                publishedAt: "",
            },
            {
                id: "2",
                title: "개나리,벚꽃,봄길,봄거리",
                videoUrl: "https://youtu.be/Nvrj6Mjy4Do?si=1yJxiulTuJbI-RSQ",
                duration: "",
                publishedAt: "",
            },
            {
                id: "3",
                title: "토끼풀,클로바,바람,오월",
                videoUrl: "https://youtu.be/gCLUmdSguYc?si=qNoIsA6tZAZlnINr",
                duration: "",
                publishedAt: "",
            },
        ];
        setVideos(tempData);
    }, []);

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
                        <ListItemButton
                            onClick={() =>
                                navigate(`${video.id}`, { state: { video } })
                            }
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
                                        >
                                            길이:{" "}
                                            {formatDuration(video.duration)} |
                                            등록일:{" "}
                                            {formatDate(video.publishedAt)}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItemButton>
                    </Paper>
                ))}
            </List>
        </Paper>
    );
}
