import React from "react";
import { GridFooterContainer } from "@mui/x-data-grid";
import TablePagination from "./TablePagination";
import { type PageType } from "../../../redux/slices/pagination";

interface CustomTableFooterProps {
  currentPage: PageType;
  dataCount?: number;
  tableOnly?: boolean;
}
const TableFooter = React.memo(
  ({
    currentPage,
    dataCount,
    tableOnly,
  }: CustomTableFooterProps): JSX.Element => {
    return (
      <>
        {!tableOnly && (
          <GridFooterContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              currentPage={currentPage}
              totalCount={dataCount}
              tableOnly={tableOnly}
            />
          </GridFooterContainer>
        )}
      </>
    );
  }
);

export default TableFooter;
