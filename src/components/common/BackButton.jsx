import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/**
 * 뒤로 가기 버튼
 * @param {() => void} onClick -- 클릭 시 뒤로가기 핸들러
 */
export default function BackButton({ onClick }) {
    return (
        <IconButton size="small" onClick={onClick} sx={{ mr: 1 }}>
            <ArrowBackIcon />
        </IconButton>
    );
}
