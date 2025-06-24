import { useLocation, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Divider } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
    getWatchedTimeAPI,
    saveLectureTimelineAPI,
} from "../../api/lectureHistory";
import VideoHeader from "../../components/video_watch/VideoHeader";
import VideoPlayerWrapper from "../../components/video_watch/VideoPlayerWrapper";
import WatchProgressBox from "../../components/video_watch/WatchProgressBox";

export default function LectureVideoWatch() {
    const navigate = useNavigate();
    const location = useLocation();
    const video = location.state?.video;

    const [initialWatchedSec, setInitialWatchedSec] = useState(0);
    const [totalWatched, setTotalWatched] = useState(0); // 누적 시청 시간
    const [durationSec, setDurationSec] = useState(0); // 전체 영상 길이
    const [watchedSec, setWatchedSec] = useState(0); // 지금 이 페이지에 들어와서 시청한 시간
    const [watchInterval, setWatchInterval] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);

    const playerRef = useRef(null);

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
            !video ||
            video.watched ||
            watchedSec < 1 ||
            isSaving ||
            hasSaved ||
            !playerRef.current
        )
            return;

        setIsSaving(true);
        try {
            const duration = playerRef.current.getDuration();
            setDurationSec(duration);

            const updatedTotalWatched = initialWatchedSec + watchedSec;
            setTotalWatched(updatedTotalWatched);

            const attendance = updatedTotalWatched / duration >= 0.5;

            const payload = {
                lectureId: Number(video.id),
                watchedTime: Number(updatedTotalWatched.toFixed(1)),
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
    }, [video]);

    useEffect(() => {
        if (!video || !video.id) return;

        const fetchInitialWatchedTime = async () => {
            try {
                const watchedTime = await getWatchedTimeAPI(video.id);
                setInitialWatchedSec(watchedTime);
            } catch (err) {
                console.error("누적 시청 시간 불러오기 실패:", err);
            }
        };

        fetchInitialWatchedTime();
    }, [video, video.id]);

    useEffect(() => {
        if (initialWatchedSec && durationSec) {
            setTotalWatched(initialWatchedSec);
        }
    }, [initialWatchedSec, durationSec]);

    return (
        <Box sx={{ p: 3 }}>
            <VideoHeader video={video} onBack={() => navigate(-1)} />

            <Divider sx={{ mb: 2 }} />

            <VideoPlayerWrapper
                videoUrl={video.videoUrl}
                playerRef={playerRef}
                onPlay={handlePlay}
                onPause={handleStop}
                onEnded={handleStop}
                onDuration={(d) => setDurationSec(d)}
            />

            <WatchProgressBox
                totalWatched={totalWatched}
                durationSec={durationSec}
            />
        </Box>
    );
}
