import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * 취소 (개설 강의 목록으로 이동) & 다음 (커리큘럼 등록으로 이동) 버튼
 */
export default function ActionButtons() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                mt: 2,
            }}
        >
            <Button
                size="large"
                variant="outlined"
                onClick={() => navigate("/teach/courses/my")}
            >
                취소
            </Button>
            <Button
                type="submit"
                size="large"
                variant="contained"
                color="primary"
            >
                다음
            </Button>
        </Box>
    );
}
