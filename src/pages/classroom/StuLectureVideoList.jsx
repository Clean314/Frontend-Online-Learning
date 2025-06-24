import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentLectureListAPI } from "../../api/lecture";
import StuVideoList from "../../components/video/StuVideoList";

export default function StuLectureVideoList() {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [videos, setVideos] = useState([]); // 영상 목록 (메타정보 + 시청 여부)
    const [metaFetched, setMetaFetched] = useState(false); // 메타 정보 API 호출 관리

    // 강의 영상 목록 조회
    useEffect(() => {
        (async () => {
            try {
                // API 호출: lecture_id, title, video_url, createdAt, updatedAt, course_id 들을 리턴
                const data = await getStudentLectureListAPI(Number(courseId));

                // 필요한 필드로 매핑: { id, title, videoUrl, duration, publishedAt } + 썸네일
                const mapped = data.map((lec) => {
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
                        id: lec.lecture_id,
                        title: lec.title,
                        videoUrl: lec.video_url,
                        duration: "",
                        publishedAt: lec.createdAt,
                        watched: lec.attendance,
                        thumbnail: videoId
                            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                            : null,
                    };
                });

                setVideos(mapped);
            } catch (err) {
                console.error("강의 영상 목록 조회 실패:", err);
            }
        })();
    }, [courseId]);

    // 영상 메타 정보 조회 (YouTube Data API)
    // API Key 저장한 .env.local 파일 필요
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

    return (
        <StuVideoList
            videos={videos}
            onItemClick={(video) =>
                navigate(`${video.id}`, { state: { video } })
            }
        />
    );
}
