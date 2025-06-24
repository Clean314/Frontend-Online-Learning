import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * 유튜브 영상 미리보기 다이얼로그
 *
 * @param {Object} props
 * @param {boolean} props.open - 열림 여부
 * @param {string|null} props.videoId - 유튜브 영상 ID
 * @param {Function} props.onClose - 닫기 핸들러
 */
export default function EduVideoDialog({ open, videoId, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                영상 미리보기
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {videoId ? (
                    <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title="YouTube video"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                borderRadius: 8,
                            }}
                        />
                    </Box>
                ) : (
                    <Typography>영상 ID를 불러오지 못했습니다.</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
}
