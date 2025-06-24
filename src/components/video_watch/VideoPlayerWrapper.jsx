import { Box } from "@mui/material";
import ReactPlayer from "react-player";

/**
 * 강의 영상 플레이어 영역
 *
 * @param {Object} props
 * @param {string} props.videoUrl - 영상 URL
 * @param {React.RefObject} props.playerRef - ReactPlayer 참조
 * @param {Function} props.onPlay - 영상 재생 핸들러
 * @param {Function} props.onPause - 영상 일시정지 핸들러
 * @param {Function} props.onEnded - 영상 종료 핸들러
 * @param {Function} props.onDuration - 영상 길이 수신 핸들러
 */
export default function VideoPlayerWrapper({
    videoUrl,
    playerRef,
    onPlay,
    onPause,
    onEnded,
    onDuration,
}) {
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
                url={getEmbedUrl(videoUrl)}
                controls
                width="100%"
                height="100%"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
                onPlay={onPlay}
                onPause={onPause}
                onEnded={onEnded}
                onDuration={onDuration}
            />
        </Box>
    );
}
