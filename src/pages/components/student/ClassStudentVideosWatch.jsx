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
import { saveLectureTimelineAPI } from "../../../api/lectureHistory";

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

    // 재생 시작 시각 저장
    const [startTime, setStartTime] = useState(null);
    const playerRef = useRef(null);

    // 재생 시작 핸들러
    const handlePlay = () => {
        setStartTime(Date.now());
    };

    // 일시정지·종료 핸들러
    const handleStop = async () => {
        if (!startTime) return;

        const endTime = Date.now();
        const watchedSec = (endTime - startTime) / 1000; // 재생 지속 시간(초)
        const durationSec = playerRef.current.getDuration(); // 전체 영상 길이(초)

        // 이전에 DB에 저장된 시청 시간 조회
        let previousWatched = 0;
        try {
            // const history = await getLectureHistoryAPI(video.id);

            // if (history && history.startTime && history.endTime) {
            //     const prevStart = new Date(history.startTime).getTime();
            //     const prevEnd = new Date(history.endTime).getTime();
            //     previousWatched = Math.max((prevEnd - prevStart) / 1000, 0);
            // }

            console.log("출석 정보 조회 성공:", previousWatched);
        } catch (err) {
            console.error("출석 정보 조회 API 에러:", err);
        }

        // 누적 시청 시간 계산
        const totalWatched = previousWatched + Math.round(watchedSec);
        // 누적 비율이 50% 이상일 때 출석 처리 (2배속 시청 고려)
        const attendance = totalWatched / durationSec >= 0.5;

        const payload = {
            videoId: video.id,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
        };

        try {
            await saveLectureTimelineAPI(payload);
            console.log("시청 기록 저장 성공");
        } catch (err) {
            console.error("출석 처리 API 에러:", err);
        }

        // 다음 재생 구간을 위해 초기화
        setStartTime(null);
    };

    // 페이지 언마운트(뒤로가기 등) 시에도 handleStop 호출
    useEffect(() => {
        return () => {
            if (startTime !== null) {
                handleStop();
            }
        };
    }, []);

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

            {/* 유튜브 영상 임베드 (16:9 비율 유지) */}
            <Box
                sx={{
                    position: "relative",
                    pb: "56.25%", // 9/16 = 0.5625
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
