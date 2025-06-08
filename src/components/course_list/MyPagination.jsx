import { Stack, Pagination } from "@mui/material";

/**
 * 페이징 컴포넌트
 * @param {number} page
 * @param {number} totalPages
 * @param {(e,value)=>void} onChange
 * @param {number} boundaryCount
 * @param {number} siblingCount
 */
export default function MyPagination({
    page,
    totalPages,
    onChange,
    boundaryCount,
    siblingCount,
}) {
    return (
        <Stack alignItems="center" mt={2}>
            <Pagination
                count={totalPages}
                page={page + 1}
                onChange={onChange}
                showFirstButton
                showLastButton
                boundaryCount={boundaryCount}
                siblingCount={siblingCount}
            />
        </Stack>
    );
}
