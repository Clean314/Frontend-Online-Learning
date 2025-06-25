import {
    Box,
    TextField,
    Radio,
    IconButton,
    Typography,
    Button,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";

/**
 * 선다형 선택지 편집 컴포넌트
 *
 * @param {Object} props
 * @param {string[]} props.choices - 선택지 배열
 * @param {(newChoices: string[]) => void} props.onChange - 선택지 배열 변경 핸들러
 * @param {number | null} props.answerIndex - 정답 선택지 인덱스
 * @param {(index: number | null) => void} props.setAnswerIndex - 정답 인덱스 설정 함수
 */
export default function ChoiceListEditor({
    choices,
    onChange,
    answerIndex,
    setAnswerIndex,
}) {
    const handleChoiceChange = (index, value) => {
        const updated = [...choices];
        updated[index] = value;
        onChange(updated);
    };

    const addChoice = () => {
        if (choices.length < 10) {
            onChange([...choices, ""]);
        }
    };

    const removeChoice = (index) => {
        if (choices.length <= 2) return;
        const updated = choices.filter((_, i) => i !== index);
        onChange(updated);
        if (answerIndex === index) {
            setAnswerIndex(null);
        } else if (answerIndex > index) {
            setAnswerIndex(answerIndex - 1);
        }
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" mb={1}>
                선택지
            </Typography>
            {choices.map((choice, idx) => (
                <Box key={idx} display="flex" alignItems="center" mb={1}>
                    <Radio
                        checked={answerIndex === idx}
                        onChange={() => setAnswerIndex(idx)}
                        value={idx}
                    />
                    <TextField
                        placeholder={`보기 ${idx + 1}`}
                        value={choice}
                        onChange={(e) =>
                            handleChoiceChange(idx, e.target.value)
                        }
                        fullWidth
                        error={!choice.trim()}
                    />
                    <IconButton
                        color="error"
                        onClick={() => removeChoice(idx)}
                        sx={{ ml: 1 }}
                        size="small"
                    >
                        <RemoveIcon />
                    </IconButton>
                </Box>
            ))}
            <Button
                startIcon={<AddIcon />}
                onClick={addChoice}
                size="small"
                sx={{ mt: 1 }}
            >
                선택지 추가
            </Button>
        </Box>
    );
}
