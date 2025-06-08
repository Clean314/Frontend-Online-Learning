import { Stack, Pagination } from "@mui/material";

/**
 * 내 수강목록 페이징
 * @param {number} page
 * @param {number} totalPages
 * @param {(e,value)=>void} onChange
 */
export default function MyPagination({ page, totalPages, onChange }) {
    return (
        <Stack alignItems="center" mt={2}>
            <Pagination
                count={totalPages}
                page={page + 1}
                onChange={onChange}
                showFirstButton
                showLastButton
                boundaryCount={1}
                siblingCount={1}
            />
        </Stack>
    );
}
