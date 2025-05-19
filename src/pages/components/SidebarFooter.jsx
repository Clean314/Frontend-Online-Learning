import { Box, Typography, Avatar, Button, useTheme } from "@mui/material";
import useAuth from "../../hooks/auth/useAuth";

export default function SidebarFooter({ mini }) {
    const theme = useTheme();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("로그아웃 실패", err);
        }
    };

    if (!user) return null;

    return (
        <Box
            sx={{
                mt: "auto",
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexDirection: mini ? "column" : "row",
            }}
        >
            <Avatar sx={{ width: 32, height: 32 }}>
                {user.name?.charAt(0) || "U"}
            </Avatar>
            {!mini && (
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                        {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                        {user.email}
                    </Typography>
                </Box>
            )}
            <Button size="small" variant="outlined" onClick={handleLogout}>
                로그아웃
            </Button>
        </Box>
    );
}
