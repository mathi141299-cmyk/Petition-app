import React from "react";
import { Box, alpha, styled, useTheme } from "@mui/material";
import { type Theme } from "@mui/material/styles";
import {
  DataGrid,
  gridClasses,
  type GridEventListener,
} from "@mui/x-data-grid";
import { type ChangeEvent } from "react";
import CustomTableFooter from "./TableFooter";

export type GridRowData = Record<string, unknown>;
interface CustomDataGridProps {
  flag?: boolean;
  title?: string;
  subtitle?: string;
  columns: any;
  rows?: GridRowData[] | any;
  isEnableActionBtn?: boolean;
  addButtonTitle?: string;
  addButtonTitle2?: string;
  editButtonTitle?: string;
  isShowExport?: boolean;
  searchEnabled?: boolean;
  currentPage?: any;
  onAddUserClick?: () => void;
  onUploadButtonClick?: (e: ChangeEvent<HTMLInputElement>) => void;
  onEditClick?: (row: GridRowData) => void;
  onDeleteClick?: (row: GridRowData) => void;
  onAddButtonClick?: () => void;
  onAddButtonClick2?: () => void;
  handleFilterClick?: () => void;
  onUpdateButtonClick?: () => void;
  onExportClick?: () => void;
  handleSearch?: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  pageCount?: number | any;
  hideActionsCondition?: (row: GridRowData) => boolean;
  getRowId?: (row: GridRowData) => string;
  getRowClassName?: (params: { indexRelativeToCurrentPage: number }) => string;
  onRowClick?: GridEventListener<"rowClick">;
  sortModel?: () => void;
  onSortModelChange?: () => void;
  sortingMode?: string;
  isFilterEnabled?: boolean;
  isSearchOpen?: boolean;
  isFilterOpen?: boolean;
  FilterElement?: React.ComponentType<any>;
  SearchElement?: React.ComponentType<any>;
  handleSearchClick?: () => void;
  loading?: any;
  tableOnly?: boolean;
  customizedTable?: boolean;
}
const TableDataGrid = React.memo((props: CustomDataGridProps) => {
  const {
    columns,
    rows,
    getRowId,
    getRowClassName,
    onRowClick,
    pageCount,
    currentPage,
    loading,
    tableOnly,
    customizedTable,
  } = props;
  const currentTheme = useTheme();
  const colors = currentTheme.palette;
  const ODD_OPACITY = 0.2;
  const StripedDataGrid = styled(DataGrid)(({ theme }: { theme: Theme }) => ({
    fontFamily: ["Inter", "Source Sans Pro", "sans-serif"].join(","),
    WebkitFontSmoothing: "auto",
    letterSpacing: "normal",
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: colors.primary.main,
      "&:hover, &.Mui-hovered": {
        backgroundColor: "#00FF00",
        "@media (hover: none)": {
          backgroundColor: "transparent",
        },
      },

      "&.Mui-selected": {
        backgroundColor: "#ECF4FF !important",
        color: colors.backgroundPrimary,
        border: "1px solid blue !important",
        "&:hover, &.Mui-hovered": {
          backgroundColor: "#ECF4FF !important",
          "@media (hover: none)": {
            backgroundColor: alpha(
              "rgba(199, 221, 199, 0.19)",
              ODD_OPACITY + theme.palette.action.selectedOpacity
            ),
          },
        },
      },
    },
    "& Mui-data-grid": {
      ":hover": {
        backgroundColor: colors.primary.lighter,
      },
    },
    backgroundColor: colors.primary.backgroundPrimary,
    borderRadius: 12,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    height: "62% !important",
    "& .MuiDataGrid-root": {
      border: "none",
    },
    "& .MuiDataGrid-columnHeaders": {
      maxHeight: "50px !important",
      minHeight: "50px !important",
    },
    "& .MuiDataGrid-main": {
      border: "1px solid #ebebeb !important",
      borderRadius: "5px",
      mt: "20px",
    },
    ".MuiDataGrid-iconButtonContainer": {
      visibility: "visible",
    },
    ".MuiDataGrid-sortIcon": {
      opacity: "inherit !important",
    },

    "& .MuiDataGrid-columnHeadersInner": {
      transform: 0,
    },
    "& .MuiDataGrid-columnHeaderTitleContainerContent": {
      width: "100%",
    },
    "& .MuiDataGrid-cell": {
      borderBottom: "none",
      fontSize: "1rem !important",
      h5: {
        fontSize: "13px",
        fontWeight: "400",
      },
    },
    "& .MuiDataGrid-colCell, & .MuiDataGrid-colCellSortable": {
      fontSize: "1rem !important",
    },
    "& .MuiDataGrid-columnHeader .MuiDataGrid-columnSeparator": {
      display: "none",
    },

    "& .MuiDataGrid-columnHeader": {
      backgroundColor: customizedTable
        ? colors.backgroundPrimary.main
        : "#FFF2E7",
      color: customizedTable ? colors.textPrimary.main : colors.primary.main,
      borderBottom: "none !important",
      fontSize: "13px",
      fontWeight: "500",
      h5: {
        fontSize: "13px",
        fontWeight: "500",
      },
    },

    "& .MuiDataGrid-columnHeader:focus": {
      outline: 0,
    },
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: colors.backgroundPrimary,
    },
    "& .MuiPaginationItem-root": {
      margin: 0,
      borderRadius: 0,
      border: "1px solid rgba(235, 235, 235, 1)",
    },
    "& .MuiPagination-ul": {
      "& li": {
        "&:first-child button": {
          borderRadius: "5px 0px 0px 5px",
        },
        "&:last-child button": {
          borderRadius: "0px 5px 5px 0px",
        },
      },
    },
  }));

  return (
    <Box sx={{ mt: "20px" }}>
      <StripedDataGrid
        loading={loading}
        sx={{
          border: "none !important",

          borderColor: "none !!important",
          "& .MuiDataGrid-cell:hover": {
            color: "black !important",
          },
          "& .MuiDataGrid-row": {
            color: "textPrimary.main",
            borderTop: "1px solid #EBEBEB",
          },
          padding: 0,
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          "& .MuiDataGrid-withBorderColor": {
            border: "none",
          },
          "& .MuiDataGrid-virtualScrollerContent": {
            height: rows?.length > 0 ? "100%" : "50px !important",
          },
          ...(customizedTable && {
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: "#F8F8F8;",
            },
          }),
          ...(onRowClick && {
            cursor: "pointer",
          }),
        }}
        columns={columns}
        rows={rows}
        onRowClick={onRowClick}
        getRowId={getRowId}
        disableColumnMenu
        components={{
          Footer: () => (
            <CustomTableFooter
              currentPage={currentPage}
              dataCount={Number(pageCount)}
              tableOnly={tableOnly}
            />
          ),
        }}
        getRowClassName={getRowClassName}
      />
    </Box>
  );
});

export default TableDataGrid;
