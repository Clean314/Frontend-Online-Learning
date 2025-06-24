/**
 * ISO 8601 형식의 길이를 HH:MM:SS 문자열로 변환
 */
export function formatDuration(isoDuration) {
    if (!isoDuration) return "-";
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "-";

    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);

    return [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
    ].join(":");
}

/**
 * ISO 문자열을 YYYY.MM.DD 형식으로 포맷
 */
export function formatDate(isoString) {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}.${m}.${d}`;
}

/**
 * 초 단위 시간을 HH시간 MM분 SS초 형식으로 변환
 */
export function formatTimeFromSeconds(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
        return `${h.toString().padStart(2, "0")}시간 ${m
            .toString()
            .padStart(2, "0")}분 ${s.toString().padStart(2, "0")}초`;
    } else if (m > 0) {
        return `${m.toString().padStart(2, "0")}분 ${s
            .toString()
            .padStart(2, "0")}초`;
    } else {
        return `${s.toString().padStart(2, "0")}초`;
    }
}
