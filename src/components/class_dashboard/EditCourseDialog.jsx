import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Button,
} from "@mui/material";
import CategorySelect from "../course/CategorySelect";
import CourseNameField from "../course/CourseNameField";
import CreditSelect from "../course/CreditSelect";
import DifficultySelect from "../course/DifficultySelect";
import MaxEnrollmentField from "../course/MaxEnrollmentField";
import DescriptionField from "../course/DescriptionField";

/**
 * 강의 정보 수정 모달 컴포넌트
 *
 * @param open -- 모달 오픈 여부 (true/false)
 * @param onClose -- 모달을 닫을 때 호출되는 핸들러
 * @param onSave -- 저장 버튼 클릭 시 호출되는 핸들러
 * @param formData -- 강의 수정 폼의 현재 값 (상태)
 * @param setFormData -- 폼 입력 변경 시 상태 업데이트 함수
 * @param firstFieldRef -- 모달 열릴 때 포커싱할 첫 번째 필드 ref
 * @param editButtonRef -- 모달 닫을 때 포커스를 다시 줄 버튼 ref
 */
export default function EditCourseDialog({
    open,
    onClose,
    onSave,
    formData,
    setFormData,
    firstFieldRef,
    editButtonRef,
}) {
    // 폼 입력 변경 핸들러
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const parsed = type === "number" ? Number(value) : value;
        setFormData((prev) => ({ ...prev, [name]: parsed }));
    };

    // 모달 열릴 때 첫 필드에 포커스
    const handleAfterOpen = () => {
        firstFieldRef?.current?.focus?.();
    };

    // 모달 닫힐 때 편집 버튼에 포커스 복귀
    const handleAfterClose = () => {
        editButtonRef?.current?.focus?.();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                transition: {
                    onEntered: handleAfterOpen,
                    onExited: handleAfterClose,
                },
            }}
        >
            <DialogTitle>강의 기본 정보 수정</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    id="edit-course-form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 1,
                    }}
                >
                    {/* 카테고리 + 강의명 */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <CategorySelect
                            value={formData.category}
                            onChange={handleChange}
                            inputRef={firstFieldRef}
                        />
                        <CourseNameField
                            value={formData.course_name}
                            onChange={handleChange}
                        />
                    </Box>

                    {/* 학점 + 난이도 + 최대 수강 인원 */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <CreditSelect
                            value={formData.point}
                            onChange={handleChange}
                        />
                        <DifficultySelect
                            value={formData.difficulty}
                            onChange={handleChange}
                        />
                        <MaxEnrollmentField
                            value={formData.max_enrollment}
                            onChange={handleChange}
                        />
                    </Box>

                    {/* 상세 설명 */}
                    <DescriptionField
                        value={formData.description}
                        onChange={handleChange}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose}>취소</Button>
                <Button
                    type="submit"
                    form="edit-course-form"
                    variant="contained"
                    onClick={onSave}
                >
                    저장
                </Button>
            </DialogActions>
        </Dialog>
    );
}
