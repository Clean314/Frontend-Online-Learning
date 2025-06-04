import { Box, Typography, Stack, Button, Drawer } from "@mui/material";

/**
 * “회원 탈퇴” 버튼과 하단 Drawer
 * @param openDeleteCurtain -- Drawer 열림 여부
 * @param onOpenDelete -– “회원 탈퇴” 버튼 클릭 시 호출되는 핸들러
 * @param onCloseDelete -- “취소” 클릭 or Drawer 바깥 클릭 시 호출되는 핸들러
 * @param onConfirmDelete -- “탈퇴하기” 클릭 시 호출되는 핸들러
 */
export default function DeleteDrawer({
    openDeleteCurtain,
    onOpenDelete,
    onCloseDelete,
    onConfirmDelete,
}) {
    return (
        <>
            <Box sx={{ mt: 6, textAlign: "center" }}>
                <Button color="error" variant="outlined" onClick={onOpenDelete}>
                    회원 탈퇴
                </Button>
            </Box>

            <Drawer
                anchor="bottom"
                open={openDeleteCurtain}
                onClose={onCloseDelete}
                ModalProps={{ keepMounted: true }}
            >
                <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="h6" gutterBottom>
                        정말 탈퇴하시겠습니까?
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        탈퇴하시면 계정과 모든 데이터가 삭제됩니다.
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button onClick={onCloseDelete}>취소</Button>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={onConfirmDelete}
                        >
                            탈퇴하기
                        </Button>
                    </Stack>
                </Box>
            </Drawer>
        </>
    );
}
