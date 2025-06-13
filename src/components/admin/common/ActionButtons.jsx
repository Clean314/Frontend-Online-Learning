import { Stack, IconButton } from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
} from "@mui/icons-material";

/**
 * 행 단위 액션 버튼들 (수정, 삭제, 저장, 취소)
 * @param {Object} props
 * @param {boolean} props.isEditing - 편집 모드 여부
 * @param {function} props.onEdit - 편집 시작 핸들러 (id: any)
 * @param {function} props.onSave - 저장 핸들러 (id: any)
 * @param {function} props.onCancel - 편집 취소 핸들러
 * @param {function} props.onDelete - 삭제 핸들러 (id: any)
 * @param {any} props.id - 해당 행의 식별자
 */
export default function ActionButtons({
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    id,
}) {
    return (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
            {isEditing ? (
                <>
                    <IconButton color="primary" onClick={() => onSave(id)}>
                        <SaveIcon />
                    </IconButton>
                    <IconButton color="inherit" onClick={onCancel}>
                        <CancelIcon />
                    </IconButton>
                </>
            ) : (
                <>
                    <IconButton color="primary" onClick={() => onEdit(id)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(id)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            )}
        </Stack>
    );
}
