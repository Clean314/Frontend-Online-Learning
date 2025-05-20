import {
    Box,
    Typography,
    Avatar,
    Button,
    useTheme,
    Menu,
    Divider,
    MenuItem,
    IconButton,
} from "@mui/material";
import useAuth from "../../hooks/auth/useAuth";
import { useState } from "react";

export default function SidebarFooter({ mini }) {
    const theme = useTheme();
    const { user, logout } = useAuth();

    // 사용자 정보 토글 효과 관련
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("로그아웃 실패", err);
        }
    };

    if (!user) return null;

    return (
        <>
            <Box
                sx={{
                    mt: "auto",
                    p: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: mini ? "column" : "row",
                    gap: mini ? 0 : 1,
                }}
            >
                <IconButton
                    onClick={mini ? handleClick : undefined}
                    size="small"
                >
                    <Avatar sx={{ width: 32, height: 32 }}>
                        {user.name?.charAt(0) || "U"}
                    </Avatar>
                </IconButton>

                {!mini && (
                    <>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography
                                variant="body2"
                                noWrap
                                sx={{ fontWeight: 500 }}
                            >
                                {user.name}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                            >
                                {user.email}
                            </Typography>
                        </Box>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </Button>
                    </>
                )}
            </Box>

            {mini && (
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            ml: 4.5,
                            mt: 2,
                            minWidth: 200,
                            p: 1,
                            overflow: "visible",
                        },
                    }}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    container={document.body}
                >
                    <Box
                        sx={{
                            mt: "auto",
                            p: 2,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>
                            {user.name?.charAt(0) || "U"}
                        </Avatar>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography
                                variant="body2"
                                noWrap
                                sx={{ fontWeight: 500 }}
                            >
                                {user.name}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                            >
                                {user.email}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ px: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => {
                                handleClose();
                                logout();
                            }}
                        >
                            로그아웃
                        </Button>
                    </Box>
                </Menu>
            )}
        </>
    );
}
