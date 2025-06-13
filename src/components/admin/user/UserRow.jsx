import {
    TableRow,
    TableCell,
    TextField,
    Select,
    MenuItem,
} from "@mui/material";
import { ROLE_OPTIONS } from "../../../constants/userRoles";
import ActionButtons from "../common/ActionButtons";

/**
 * 개별 회원 행 컴포넌트 (보기/편집 모드)
 * @param {Object} props
 * @param {Object} props.user - 회원 데이터 객체
 * @param {boolean} props.isEditing - 편집 모드 여부
 * @param {Object} props.editedData - 편집 중인 회원 데이터
 * @param {function} props.onEdit - 편집 시작 핸들러 (user 객체)
 * @param {function} props.onSave - 저장 핸들러 (id)
 * @param {function} props.onCancel - 편집 취소 핸들러
 * @param {function} props.onDelete - 삭제 핸들러 (id)
 * @param {function} props.onChange - 입력값 변경 핸들러 (e)
 */
export default function UserRow({
    user,
    isEditing,
    editedData,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    onChange,
}) {
    return (
        <TableRow hover key={user.id}>
            <TableCell>{user.id}</TableCell>
            {isEditing ? (
                <>
                    <TableCell>
                        <TextField
                            name="name"
                            value={editedData.name}
                            onChange={onChange}
                            size="small"
                        />
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Select
                            name="role"
                            value={editedData.role}
                            onChange={onChange}
                            size="small"
                        >
                            {ROLE_OPTIONS.map((r) => (
                                <MenuItem key={r} value={r}>
                                    {r}
                                </MenuItem>
                            ))}
                        </Select>
                    </TableCell>
                    <TableCell align="right">
                        <ActionButtons
                            isEditing
                            onSave={() => onSave(user.id)}
                            onCancel={onCancel}
                            id={user.id}
                        />
                    </TableCell>
                </>
            ) : (
                <>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="right">
                        <ActionButtons
                            isEditing={false}
                            onEdit={() => onEdit(user)}
                            onDelete={() => onDelete(user.id)}
                            id={user.id}
                        />
                    </TableCell>
                </>
            )}
        </TableRow>
    );
}
