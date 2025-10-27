import React from "react";
import { Box, debounce, Grid, Tooltip, Typography } from "@mui/material";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { Sort, TextField, Select } from "../../../components/basic";
import { RouteUrls } from "../../../constants/routes";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import TableFooter from "../../../components/shared/dataTable/TableFooter";

import { DialogWrapper } from "../../../components/shared";
import { DataTable } from "../../../components/shared";
import {
  getPetitionsReportDetail,
  getAllPetitionsReportDetail,
} from "../../../services/petitionService";

type RestaurantBillList = {
  filters?: any;
  setReportData?: any;
  isGetAllData?: any;
  setReportName?: any;
};

const PetitionReportList = React.memo(
  ({
    filters,
    setReportData,
    isGetAllData,
    setReportName,
  }: RestaurantBillList) => {
    const { petitionReportList } = useSelector(
      (state: RootState) => state.pagination
    );

    const [isFieldSort, setIsFieldSort] = useState<boolean>(false);

    const [sortedField, setSortedField] = useState<{
      order: string | null;
      field: string | null;
    }>({
      order: null,
      field: null,
    });

    const handleSorting = (field: string) => {
      setIsFieldSort(!isFieldSort);
      setSortedField({ field: field, order: isFieldSort ? "ASC" : "DESC" });
    };

    const [list, setList] = useState<any>({
      count: 0,
      rows: [],
    });

    const [isInputFieldChanged, setIsInputFieldChanged] = useState<any>(false);
    const [id, setId] = useState<any>(null);

    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

    const [isDialogLoading, setIsDialogLoading] = useState<boolean>(false);
    const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
    const [feedbackHistory, setFeedbackHistory] = useState<any>([]);

    const columns: any[] = [
      {
        field: "petitionNo",
        flex: 0.8,
        renderHeader: () => (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              height: "51px",
              cursor: "pointer",
            }}
            onClick={() => handleSorting("petition_no")}
          >
            <Typography variant="h5" fontSize={14}>
              Petition No
            </Typography>
            <Sort
              ascendingActive={
                sortedField.field === "petition_no" &&
                sortedField.order === "ASC"
                  ? true
                  : false
              }
              descendingActive={
                sortedField.field === "petition_no" &&
                sortedField.order === "DESC"
                  ? true
                  : false
              }
            />
          </Grid>
        ),
        renderCell: ({ row }: any) => (
          <Tooltip
            title={<Box sx={{ fontSize: "14px" }}>{row?.petitionNo}</Box>}
            arrow
            enterDelay={500}
            leaveDelay={200}
          >
            <Box
              sx={{
                overflow: "hidden",
                mr: "10px",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row?.petitionNo}
              </Typography>
            </Box>
          </Tooltip>
        ),
        minWidth: 100,
        sortable: false,
      },
      {
        field: "petitionerName",
        flex: 1,
        renderHeader: () => (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              height: "51px",
              cursor: "pointer",
            }}
            onClick={() => handleSorting("petitioner_name")}
          >
            <Typography variant="h5" fontSize={14}>
              Name
            </Typography>
            <Sort
              ascendingActive={
                sortedField.field === "petitioner_name" &&
                sortedField.order === "ASC"
                  ? true
                  : false
              }
              descendingActive={
                sortedField.field === "petitioner_name" &&
                sortedField.order === "DESC"
                  ? true
                  : false
              }
            />
          </Grid>
        ),
        renderCell: ({ row }: any) => (
          <Tooltip
            title={<Box sx={{ fontSize: "14px" }}>{row?.name}</Box>}
            arrow
            enterDelay={500}
            leaveDelay={200}
          >
            <Box
              sx={{
                overflow: "hidden",
                mr: "10px",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row?.name}
              </Typography>
            </Box>
          </Tooltip>
        ),
        minWidth: 160,
        sortable: false,
      },
      {
        field: "mobile",
        flex: 0.8,
        renderHeader: () => (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              height: "51px",
              cursor: "pointer",
            }}
            onClick={() => handleSorting("mobile")}
          >
            <Typography variant="h5" fontSize={14}>
              Mobile
            </Typography>
            <Sort
              ascendingActive={
                sortedField.field === "mobile" && sortedField.order === "ASC"
                  ? true
                  : false
              }
              descendingActive={
                sortedField.field === "mobile" && sortedField.order === "DESC"
                  ? true
                  : false
              }
            />
          </Grid>
        ),
        renderCell: ({ row }: any) => (
          <Tooltip
            title={<Box sx={{ fontSize: "14px" }}>{row?.mobile}</Box>}
            arrow
            enterDelay={500}
            leaveDelay={200}
          >
            <Box
              sx={{
                overflow: "hidden",
                mr: "10px",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row?.mobile}
              </Typography>
            </Box>
          </Tooltip>
        ),
        minWidth: 100,
        sortable: false,
      },
      {
        field: "dateAndTime",
        flex: 0.8,
        renderHeader: () => (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              height: "51px",
              cursor: "pointer",
            }}
            onClick={() => handleSorting("date_and_time")}
          >
            <Typography variant="h5" fontSize={14}>
              Date
            </Typography>
            <Sort
              ascendingActive={
                sortedField.field === "date_and_time" &&
                sortedField.order === "ASC"
                  ? true
                  : false
              }
              descendingActive={
                sortedField.field === "date_and_time" &&
                sortedField.order === "DESC"
                  ? true
                  : false
              }
            />
          </Grid>
        ),
        renderCell: ({ row }: any) => (
          <Typography variant="h5">
            {moment(row?.dateAndTime).format("DD/MM/YYYY")}
          </Typography>
        ),
        minWidth: 80,
        sortable: false,
      },
      // {
      //   field: "habitation",
      //   flex: 1,
      //   renderHeader: () => (
      //     <Grid
      //       sx={{
      //         display: "flex",
      //         flexDirection: "row",
      //         alignItems: "center",
      //         width: "100%",
      //         height: "51px",
      //         cursor: "pointer",
      //       }}
      //       onClick={() => handleSorting("habitation")}
      //     >
      //       <Typography variant="h5" fontSize={14}>
      //         Habitation
      //       </Typography>
      //       <Sort
      //         ascendingActive={
      //           sortedField.field === "habitation" &&
      //           sortedField.order === "ASC"
      //             ? true
      //             : false
      //         }
      //         descendingActive={
      //           sortedField.field === "habitation" &&
      //           sortedField.order === "DESC"
      //             ? true
      //             : false
      //         }
      //       />
      //     </Grid>
      //   ),
      //   renderCell: ({ row }: any) => (
      //     <Typography variant="h5">{row?.habitation}</Typography>
      //   ),
      //   minWidth: 120,
      //   sortable: false,
      // },
      {
        field: "typeOfIssue",
        flex: 1,
        renderHeader: () => (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              height: "51px",
              cursor: "pointer",
            }}
          >
            <Typography variant="h5" fontSize={14}>
              Type Of Issue
            </Typography>
          </Grid>
        ),
        renderCell: ({ row }: any) => (
          <Tooltip
            title={<Box sx={{ fontSize: "14px" }}>{row?.typeOfIssue}</Box>}
            arrow
            enterDelay={500}
            leaveDelay={200}
          >
            <Box
              sx={{
                overflow: "hidden",
                mr: "10px",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row?.typeOfIssue}
              </Typography>
            </Box>
          </Tooltip>
        ),
        minWidth: 120,
        sortable: false,
      },
      {
        field: "panchayat",
        flex: 1,
        renderHeader: () => (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              height: "51px",
              cursor: "pointer",
            }}
            onClick={() => handleSorting("panchayat")}
          >
            <Typography variant="h5" fontSize={14}>
              Panchayat
            </Typography>
            <Sort
              ascendingActive={
                sortedField.field === "panchayat" && sortedField.order === "ASC"
                  ? true
                  : false
              }
              descendingActive={
                sortedField.field === "panchayat" &&
                sortedField.order === "DESC"
                  ? true
                  : false
              }
            />
          </Grid>
        ),
        renderCell: ({ row }: any) => (
          <Tooltip
            title={<Box sx={{ fontSize: "14px" }}>{row?.panchayat}</Box>}
            arrow
            enterDelay={500}
            leaveDelay={200}
          >
            <Box
              sx={{
                overflow: "hidden",
                mr: "10px",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row?.panchayat}
              </Typography>
            </Box>
          </Tooltip>
        ),
        minWidth: 120,
        sortable: false,
      },
      {
        field: "fieldVisitStatus",
        flex: 1.2,
        renderHeader: () => (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              height: "51px",
              cursor: "pointer",
            }}
            onClick={() => handleSorting("fieldVisitStatus")}
          >
            <Typography variant="h5" fontSize={14}>
              Field Visit Status
            </Typography>
            <Sort
              ascendingActive={
                sortedField.field === "fieldVisitStatus" &&
                sortedField.order === "ASC"
                  ? true
                  : false
              }
              descendingActive={
                sortedField.field === "fieldVisitStatus" &&
                sortedField.order === "DESC"
                  ? true
                  : false
              }
            />
          </Grid>
        ),
        renderCell: ({ row }: any) => (
          <Typography variant="h5">
            {/* {row?.isFieldVisitRequired == 1
              ? row?.petitionFieldVisit?.fieldVisit?.visitDate !== null
                ? "Completed"
                : "Required"
              : "Not Required"} */}
            {row?.fieldStatus}
          </Typography>
        ),
        minWidth: 140,
        sortable: false,
      },
      {
        field: "letterStatus",
        flex: 1,
        renderHeader: () => (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              height: "51px",
              cursor: "pointer",
            }}
            onClick={() => handleSorting("letterStatus")}
          >
            <Typography variant="h5" fontSize={14}>
              Letter Status
            </Typography>
            <Sort
              ascendingActive={
                sortedField.field === "letterStatus" &&
                sortedField.order === "ASC"
                  ? true
                  : false
              }
              descendingActive={
                sortedField.field === "letterStatus" &&
                sortedField.order === "DESC"
                  ? true
                  : false
              }
            />
          </Grid>
        ),
        renderCell: ({ row }: any) => (
          <Typography variant="h5">{row?.letterStatus}</Typography>
        ),
        minWidth: 140,
        sortable: false,
      },
      {
        field: "finalResponseStatus",
        flex: 1.4,
        renderHeader: () => (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              height: "51px",
              cursor: "pointer",
            }}
            onClick={() => handleSorting("finalResponseStatus")}
          >
            <Typography variant="h5" fontSize={14}>
              Final Response Status
            </Typography>
            <Sort
              ascendingActive={
                sortedField.field === "finalResponseStatus" &&
                sortedField.order === "ASC"
                  ? true
                  : false
              }
              descendingActive={
                sortedField.field === "finalResponseStatus" &&
                sortedField.order === "DESC"
                  ? true
                  : false
              }
            />
          </Grid>
        ),
        renderCell: ({ row }: any) => (
          <Typography variant="h5">{row?.finalResponseStatus}</Typography>
        ),
        minWidth: 140,
        sortable: false,
      },
      {
        field: "department",
        flex: 1,
        renderHeader: () => (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              height: "51px",
              cursor: "pointer",
            }}
            // onClick={() => handleSorting("department")}
          >
            <Typography variant="h5" fontSize={14}>
              Department
            </Typography>
            {/* <Sort
              ascendingActive={
                sortedField.field === "department" &&
                sortedField.order === "ASC"
                  ? true
                  : false
              }
              descendingActive={
                sortedField.field === "department" &&
                sortedField.order === "DESC"
                  ? true
                  : false
              }
            /> */}
          </Grid>
        ),
        renderCell: ({ row }: any) => (
          <Tooltip
            title={<Box sx={{ fontSize: "14px" }}>{row?.department}</Box>}
            arrow
            enterDelay={500}
            leaveDelay={200}
          >
            <Box
              sx={{
                overflow: "hidden",
                mr: "10px",
              }}
            >
              <Typography variant="h5">{row?.department}</Typography>
            </Box>
          </Tooltip>
        ),
        minWidth: 120,
        // maxWidth: 120,
        sortable: false,
      },
    ];

    const dialogClose = () => {
      setDialogOpen(false);
    };

    const debouncedGetPetitionsList = useCallback(
      debounce((data: any) => {
        setIsTableLoading(true);
        getPetitionsReportDetail(data)
          .then((res: any) => {
            let data = {
              count: res?.data?.count,
              rows: res?.data?.formattedPetitions,
            };

            // console.log("res?.data from debouncedGetPetitionsList", res?.data);

            setList(data);

            setIsTableLoading(false);
          })
          .catch((err: any) => {
            setIsTableLoading(false);
            console.log(err);
          });
      }, 300),
      []
    );

    useEffect(() => {
      const data = {
        ...filters,
        fromDate: filters?.fromDate?.$d,
        toDate: filters?.toDate?.$d,
        page: petitionReportList.page + 1,
        size: petitionReportList.pageSize,
        order: sortedField.order,
        column: sortedField.field,
      };

      // if (
      //   (filters?.panchayatId === null && filters?.panchayatId_input === "") ||
      //   (filters?.panchayatId !== null && filters?.panchayatId_input !== "")
      // ) {
      debouncedGetPetitionsList(data);
      // }
    }, [petitionReportList, filters, sortedField]);

    const debouncedGetAllPetitionsList = debounce((data: any) => {
      getAllPetitionsReportDetail(data)
        .then((res: any) => {
          if (res.data) {
            // console.log(
            //   "qwerty res.data from debouncedGetAllBillsList",
            //   res.data
            // );
            setReportName("p&l_report");
            setReportData(res?.data?.transformedPetitions);
          }
        })
        .catch((err: any) => console.log(err));
    }, 300);

    useEffect(() => {
      if (isGetAllData === true) {
        const data = {
          ...filters,
          fromDate: filters?.fromDate?.$d,
          toDate: filters?.toDate?.$d,
          order: sortedField.order,
          column: sortedField.field,
        };
        debouncedGetAllPetitionsList(data);
      }
    }, [isGetAllData]);

    return (
      <>
        <DataTable
          columns={columns}
          getRowId={(row: any) => `${String(row.id)}`}
          rows={list.rows}
          pageCount={list?.count}
          currentPage={"petitionReportList"}
          loading={isTableLoading}
        />
      </>
    );
  }
);

export default PetitionReportList;
