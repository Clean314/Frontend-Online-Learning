import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLectureListAPI } from "../../api/lecture";
import EduVideoList from "../../components/video/EduVideoList";
import EduVideoDialog from "../../components/video/EduVideoDialog";

export default function EduLectureVideoList() {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [videos, setVideos] = useState([]); // 영상 목록 (메타정보 포함)
    const [metaFetched, setMetaFetched] = useState(false); // 메타 정보 API 호출 관리

    // 영상 미리보기
    const [open, setOpen] = useState(false);
    const [previewVideoId, setPreviewVideoId] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const lectureList = await getLectureListAPI(Number(courseId));

                // LectureDTO 배열을 컴포넌트에서 사용할 형태로 변환 + 썸네일
                const formatted = lectureList.map((lec) => {
                    let videoId = "";
                    try {
                        const parsed = new URL(lec.video_url);
                        videoId =
                            parsed.searchParams.get("v") ||
                            parsed.pathname.slice(1);
                    } catch {
                        videoId = "";
                    }

                    return {
                        id: lec.lecture_id.toString(),
                        title: lec.title,
                        videoUrl: lec.video_url,
                        duration: "",
                        publishedAt: "",
                        thumbnail: videoId
                            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                            : null,
                    };
                });
                setVideos(formatted);
            } catch (err) {
                console.error("강사용 강의 영상 목록 조회 실패", err);
            }
        })();
    }, [courseId]);

    // 영상 메타 정보 조회 (YouTube Data API)
    // API key 저장한 .env.local 파일 필요
    useEffect(() => {
        if (!videos.length || metaFetched) return;

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
            setMetaFetched(true);
        };

        fetchMetaData();
    }, [videos, metaFetched]);

    // 영상 미리보기 모달 열기
    const handleOpen = (videoUrl) => {
        try {
            const parsed = new URL(videoUrl);
            const videoId =
                parsed.searchParams.get("v") || parsed.pathname.slice(1);
            if (videoId) {
                setPreviewVideoId(videoId);
                setOpen(true);
            }
        } catch (err) {
            console.error("유효하지 않은 YouTube URL:", videoUrl);
            console.log(err);
        }
    };

    // 영상 미리보기 모달 닫기
    const handleClose = () => {
        setOpen(false);
        setPreviewVideoId(null);
    };

    return (
        <>
            <EduVideoList
                videos={videos}
                onPreview={handleOpen}
                onEdit={() => navigate("edit", { state: { videos } })}
            />
            <EduVideoDialog
                open={open}
                videoId={previewVideoId}
                onClose={handleClose}
            />
        </>
    );
}
