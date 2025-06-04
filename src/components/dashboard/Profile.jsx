import { Box, Avatar, Typography, Stack, Button } from "@mui/material";

/**
 * 사용자 정보(아바타, 이름, 이메일 등) & "프로필 수정" 버튼
 * @param user -- useAuth()로 받아온 사용자 객체
 * @param onEditClick -- "프로필 수정" 버튼 클릭 시 호출되는 핸들러
 * @param editButtonRef -- 버튼에 붙일 ref (모달 닫힐 때 포커스 복귀용)
 */
export default function Profile({ user, onEditClick, editButtonRef }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 6,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
                    {user.name.charAt(0)}
                </Avatar>
                <Box>
                    <Typography variant="h5" gutterBottom>
                        {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user.email}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {user.description ||
                            `안녕하세요. ${user.name}님의 대시보드입니다.`}
                    </Typography>
                </Box>
            </Box>

            <Stack direction="row" spacing={1}>
                <Button
                    variant="outlined"
                    onClick={onEditClick}
                    ref={editButtonRef}
                >
                    프로필 수정
                </Button>
            </Stack>
        </Box>
    );
}
