import { Box, Stack, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

/**
 * 시험 폼의 입력 필드 (제목, 설명, 시작/종료 시각)
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {dayjs.Dayjs} props.startTime
 * @param {dayjs.Dayjs} props.endTime
 * @param {Function} props.setTitle
 * @param {Function} props.setDescription
 * @param {Function} props.setStartTime
 * @param {Function} props.setEndTime
 * @param {string} props.error - 유효성 오류 메시지
 */
export default function ExamFormFields({
    title,
    description,
    startTime,
    endTime,
    setTitle,
    setDescription,
    setStartTime,
    setEndTime,
    error,
}) {
    return (
        <Stack spacing={2}>
            <TextField
                label="시험 제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
            />
            <TextField
                label="시험 설명"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                fullWidth
            />
            <Box
                display={"flex"}
                flexDirection={{ xs: "column", sm: "row" }}
                gap={2}
            >
                <DateTimePicker
                    label="시작 시각"
                    value={startTime}
                    minDateTime={dayjs().add(24, "hour")}
                    views={["year", "month", "day", "hours", "minutes"]}
                    minutesStep={5}
                    onChange={(newVal) => setStartTime(newVal.second(0))}
                    inputFormat="YYYY.MM.DD A hh:mm"
                    mask="____.__.__ _ __:__"
                    slotProps={{
                        textField: { fullWidth: true },
                        dialog: {
                            disableEnforceFocus: true,
                            disableRestoreFocus: true,
                        },
                    }}
                />
                <DateTimePicker
                    label="종료 시각"
                    value={endTime}
                    minDateTime={startTime.add(5, "minute")}
                    views={["year", "month", "day", "hours", "minutes"]}
                    minutesStep={5}
                    onChange={(newVal) => setEndTime(newVal.second(0))}
                    inputFormat="YYYY.MM.DD A hh:mm"
                    mask="____.__.__ _ __:__"
                    slotProps={{
                        textField: { fullWidth: true },
                        dialog: {
                            disableEnforceFocus: true,
                            disableRestoreFocus: true,
                        },
                    }}
                />
            </Box>
            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}
        </Stack>
    );
}
