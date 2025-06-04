import {
    Box,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

/**
 * “프로필 수정” 다이얼로그(Dialog)
 * @param openEditModal -- 다이얼로그 열림 여부
 * @param onCloseEditModal -- 닫기 버튼 클릭 or 바깥 클릭 시 호출
 * @param onAfterOpen -- 모달 열림 애니메이션 완료 후 호출 (포커스 이동용)
 * @param onAfterClose -- 모달 닫힘 애니메이션 완료 후 호출 (포커스 복귀용)
 * @param form -- { name, email, description }
 * @param onChange -- 입력 필드 onChange 핸들러
 * @param onSave -- “저장” 클릭 핸들러
 * @param firstFieldRef -- 모달 내 첫 번째 필드에 주는 ref
 */
export default function ProfileEditModal({
    openEditModal,
    onCloseEditModal,
    onAfterOpen,
    onAfterClose,
    form,
    onChange,
    onSave,
    firstFieldRef,
}) {
    return (
        <Dialog
            open={openEditModal}
            onClose={onCloseEditModal}
            maxWidth="sm"
            fullWidth
            slotProps={{
                transition: {
                    onEntered: onAfterOpen,
                    onExited: onAfterClose,
                },
            }}
        >
            <DialogTitle>프로필 수정</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 1,
                    }}
                >
                    {/* 이름 */}
                    <TextField
                        label="이름"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        fullWidth
                        required
                        inputRef={firstFieldRef}
                    />

                    {/* 이메일(수정 불가) */}
                    <TextField
                        label="이메일"
                        name="email"
                        value={form.email}
                        variant="outlined"
                        fullWidth
                        disabled
                    />

                    {/* 소개 */}
                    <TextField
                        label="소개"
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        fullWidth
                        multiline
                        rows={3}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onCloseEditModal}>취소</Button>
                <Button variant="contained" onClick={onSave}>
                    저장
                </Button>
            </DialogActions>
        </Dialog>
    );
}
