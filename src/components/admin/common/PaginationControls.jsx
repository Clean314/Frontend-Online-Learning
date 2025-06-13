import { Stack, Pagination } from "@mui/material";

/**
 * 페이지네이션 컨트롤 컴포넌트
 * @param {Object} props
 * @param {number} props.page - 현재 페이지 인덱스 (0부터 시작)
 * @param {number} props.totalPages - 전체 페이지 개수
 * @param {function} props.onPageChange - 페이지 변경 핸들러 (newPageIndex: number)
 */
export default function PaginationControls({ page, totalPages, onPageChange }) {
    return (
        <Stack alignItems="center" mt={2}>
            <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(_, value) => onPageChange(value - 1)}
                showFirstButton
                showLastButton
                boundaryCount={1}
                siblingCount={1}
            />
        </Stack>
    );
}
