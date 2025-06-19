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
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import {
    getWatchedTimeAPI,
    saveLectureTimelineAPI,
} from "../../../api/lectureHistory";

export default function ClassStudentVideosWatch() {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { videoId } = useParams();
    const video = location.state?.video;

    const playerRef = useRef(null);
    const [watchInterval, setWatchInterval] = useState(null);
    const [watchedSec, setWatchedSec] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);

    if (!video) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" color="error">
                    영상 정보를 불러올 수 없습니다.
                </Typography>
            </Paper>
        );
    }

    const startTrackingTime = () => {
        if (watchInterval) return;
        const interval = setInterval(() => {
            setWatchedSec((prev) => prev + 1);
        }, 1000);
        setWatchInterval(interval);
        setHasSaved(false);
    };

    const stopTrackingTime = () => {
        if (watchInterval) {
            clearInterval(watchInterval);
            setWatchInterval(null);
        }
    };

    const handlePlay = () => {
        startTrackingTime();
    };

    const handleStop = async () => {
        stopTrackingTime();

        if (
            video.watched ||
            watchedSec < 1 ||
            isSaving ||
            hasSaved ||
            !playerRef.current
        )
            return;

        setIsSaving(true);
        try {
            const previousWatched = await getWatchedTimeAPI(video.id);
            const totalWatched = previousWatched + watchedSec;
            const durationSec = playerRef.current.getDuration();
            const attendance = totalWatched / durationSec >= 0.5;

            const payload = {
                lectureId: Number(video.id),
                watchedTime: Number(totalWatched.toFixed(1)),
                attendance,
            };

            await saveLectureTimelineAPI(payload);
            console.log("시청 기록 저장:", payload);
        } catch (err) {
            console.error("시청 기록 저장 실패:", err);
        } finally {
            setWatchedSec(0);
            setIsSaving(false);
            setHasSaved(true);
        }
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            handleStop();
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            handleStop();
        };
    }, []);

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

    return (
        <Box sx={{ p: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                }}
            >
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
                <Typography variant="body2" color="text.secondary">
                    길이: {formatDuration(video.duration)} • 등록일:{" "}
                    {formatDate(video.publishedAt)}
                </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box
                sx={{
                    position: "relative",
                    pb: "56.25%",
                    height: 0,
                    mb: 2,
                }}
            >
                <ReactPlayer
                    ref={playerRef}
                    url={getEmbedUrl(video.videoUrl)}
                    controls
                    width="100%"
                    height="100%"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}
                    onPlay={handlePlay}
                    onPause={handleStop}
                    onEnded={handleStop}
                />
            </Box>
        </Box>
    );
}

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

const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}.${m}.${d}`;
};
