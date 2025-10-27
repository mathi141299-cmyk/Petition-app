import React from "react";
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentPage,
  type PageType,
  setRowsPerPage,
} from "../../../redux/slices/pagination";
import { ArrowBackIcon, ArrowFrontIcon } from "../../../assets/icons";

interface CustomPaginationProps {
  rowsPerPageOptions: number[];
  currentPage: PageType;
  totalCount?: number | any;
  tableOnly?: boolean;
}

const TablePagination = React.memo(
  ({
    currentPage,
    totalCount,
    rowsPerPageOptions,
    tableOnly,
  }: CustomPaginationProps): JSX.Element => {
    const pageInfo = useSelector((state: any) => state.pagination[currentPage]);
    const page = pageInfo?.page;
    const pageCount = Math.ceil(totalCount / pageInfo?.pageSize);
    const dispatch = useDispatch();
    const matches = useMediaQuery("(min-width:497px)");
    const handlePageChange = (
      event: React.ChangeEvent<unknown>,
      value: number
    ): void => {
      dispatch(setCurrentPage({ key: currentPage, value: value - 1 }));
    };
    const handleRowsPerPageChange = (
      event: SelectChangeEvent<number> // Change event type
    ): void => {
      dispatch(
        setRowsPerPage({ key: currentPage, value: Number(event.target.value) })
      );
      dispatch(setCurrentPage({ key: currentPage, value: 0 }));
    };
    const startRange = page * pageInfo?.pageSize + 1;
    const endRange =
      page === pageCount - 1 ? totalCount : (page + 1) * pageInfo?.pageSize;
    const styles = {
      mainBox: {
        flex: 1,
        display: matches ? "flex" : "grid",
        justifyContent: matches ? "space-between" : "center",
        alignItems: "center",
        width: "100%",
        margin: !matches ? "10px" : "",
      },
      paginationStyles: {
        paddingTop: !matches ? "20px" : "",
        display: !matches ? "flex" : "",
        alignItems: !matches ? "center" : "",
        justifyContent: !matches ? "center" : "",
      },
    };
    return (
      <>
        {!tableOnly && (
          <Box sx={styles.mainBox}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" sx={{ fontSize: "12px !important" }}>
                Rows Per Page
                <Select
                  labelId="rows-per-page-label"
                  id="rows-per-page"
                  value={pageInfo?.pageSize}
                  defaultValue={pageInfo?.pageSize}
                  onChange={handleRowsPerPageChange}
                  sx={{
                    marginX: 1,
                    maxHeight: 35,
                    minHeight: 35,
                    minWidth: 60,
                    maxWidth: 60,
                  }}
                >
                  {rowsPerPageOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      <Typography>{option}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Typography>

              <Typography variant="h5" sx={{ fontSize: "12px !important" }}>
                Page {startRange} to {endRange} of {totalCount}
              </Typography>
            </Box>
            <Box sx={styles.paginationStyles}>
              <Pagination
                color="primary"
                count={pageCount}
                page={page + 1}
                variant="outlined"
                shape="rounded"
                onChange={handlePageChange}
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowFrontIcon }}
                    {...item}
                  />
                )}
              />
            </Box>
          </Box>
        )}
      </>
    );
  }
);

export default TablePagination;
