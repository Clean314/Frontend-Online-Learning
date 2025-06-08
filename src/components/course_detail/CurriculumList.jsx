import React from "react";
import {
    List,
    ListItem,
    ListItemText,
    Divider,
    Typography,
} from "@mui/material";

/**
 * 커리큘럼(lecture) 목록
 * @param {{ id?: number, title: string }[]} lectures
 */
export default function CurriculumList({ lectures }) {
    return (
        <List disablePadding sx={{ mb: 4 }}>
            {lectures.map((lec, idx) => (
                <React.Fragment key={lec.id ?? idx}>
                    <ListItem
                        sx={{
                            px: 0,
                            py: 1,
                            "&:hover": { bgcolor: "action.hover" },
                        }}
                    >
                        <ListItemText
                            disableTypography
                            primary={
                                <Typography variant="body2" fontWeight={500}>
                                    {idx + 1}. {lec.title}
                                </Typography>
                            }
                        />
                    </ListItem>
                    {idx < lectures.length - 1 && <Divider component="li" />}
                </React.Fragment>
            ))}
        </List>
    );
}
