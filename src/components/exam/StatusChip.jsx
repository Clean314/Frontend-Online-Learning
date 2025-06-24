import { Chip } from "@mui/material";

/**
 * 시험 상태를 나타내는 칩 컴포넌트
 *
 * @param {Object} props
 * @param {string} props.status - 시험 상태 ("PREPARING" | "IN_PROGRESS" | "COMPLETED")
 */
export function StatusChip({ status }) {
    const getStatusChipProps = () => {
        switch (status) {
            case "PREPARING":
                return { label: "준비중", color: "default" };
            case "IN_PROGRESS":
                return { label: "진행중", color: "primary" };
            case "COMPLETED":
                return { label: "종료", color: "default" };
            default:
                return { label: status, color: "default" };
        }
    };

    return <Chip {...getStatusChipProps()} />;
}

/**
 * 시험 응시 여부를 나타내는 칩 컴포넌트
 *
 * @param {Object} props
 * @param {boolean} props.hasTaken - 시험 응시 여부
 */
export function TakenChip({ hasTaken }) {
    const props = hasTaken
        ? {
              label: "응시 완료",
              sx: { bgcolor: "#F8D7DA", color: "#721C24", fontWeight: 500 },
          }
        : {
              label: "미응시",
              sx: { bgcolor: "#D6EFD8", color: "#155724", fontWeight: 500 },
          };

    return <Chip {...props} />;
}
