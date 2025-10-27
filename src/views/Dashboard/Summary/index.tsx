import React from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

const Summary = ({ totalReportData }: any) => {
  const {
    petitionOverallCount,
    petitionCompletedCount,
    petitionPendingCount,
    petitionRejectedCount,
    fieldVisitOverallCount,
    fieldVisitCompletedCount,
    fieldVisitPendingCount,
    fieldVisitRejectedCount,
    departmentLettersOverallCount,
    departmentLettersCompletedCount,
    departmentLettersPendingCount,
    departmentLettersRejectedCount,
    departmentLettersNACount,
    finalResponseNotCreatedCount,
  } = totalReportData;

  // console.log(
  //   "qwerty",
  //   fieldVisitOverallCount,
  //   fieldVisitCompletedCount,
  //   fieldVisitPendingCount,
  //   fieldVisitRejectedCount
  // );

  const summaryInformation: any = [
    {
      name: "",
      overall: "Overall",
      completed: "Completed",
      pending: "Pending",
      rejected: "Rejected",
      notCreated: "No Response",
      // na: "NA",
    },
    {
      name: "Petition",
      overall: petitionOverallCount,
      completed: petitionCompletedCount,
      pending: petitionPendingCount,
      rejected: petitionRejectedCount,
      notCreated: finalResponseNotCreatedCount,
    },
    {
      name: "Field Visit",
      overall: fieldVisitOverallCount,
      completed: fieldVisitCompletedCount,
      pending: fieldVisitPendingCount,
      rejected: "-",
      notCreated: "-",
    },
    {
      name: "Letter",
      overall: departmentLettersOverallCount,
      completed: departmentLettersCompletedCount,
      pending: departmentLettersPendingCount,
      rejected: "-",
      notCreated: "-",
    },
  ];

  return (
    <Grid
      container
      sx={{
        width: { xs: "98vw", md: "74vw" },
        display: "flex",
        flexWrap: "wrap",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "flex-start",
        mb: "50px",
        gap: 2,
      }}
    >
      {/* --------- */}

      <Box
        sx={{
          width: { xs: "95%", sm: "90%", md: "90%", lg: "100%" },
          display: "flex",
          flexDirection: "column",
          border: 1,
          borderColor: "greyScale.lighter",
          borderRadius: "5px",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            border: "none !important",
            boxShadow: "none !important",
            // borderBottom: 1,
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none ",
              fontSize: "1rem !important",
              h5: {
                fontSize: "13px",
                fontWeight: "400",
              },
            },
          }}
        >
          <Table>
            <TableBody sx={{ borderBottom: "none " }}>
              {summaryInformation.map((row: any, index: any) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      borderRight: 1,
                      borderColor: "greyScale.lighter",
                      backgroundColor: index === 0 ? "primary.light" : "auto",
                      color: index === 0 ? "primary.main" : "auto",
                    }}
                  >
                    {row.name}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: index === 0 ? "primary.light" : "auto",
                      color: index === 0 ? "primary.main" : "auto",
                      fontWeight: index === 0 ? "600" : "500",
                      borderRight: 1,
                      borderColor: "greyScale.lighter",
                    }}
                  >
                    {row.overall || 0}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: index === 0 ? "primary.light" : "auto",
                      color: index === 0 ? "primary.main" : "auto",
                      fontWeight: index === 0 ? "600" : "500",
                      borderRight: 1,
                      borderColor: "greyScale.lighter",
                    }}
                  >
                    {row.completed || 0}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: index === 0 ? "primary.light" : "auto",
                      color: index === 0 ? "primary.main" : "auto",
                      borderRight: 1,
                      fontWeight: index === 0 ? "600" : "500",
                      borderColor: "greyScale.lighter",
                    }}
                  >
                    {row.pending || 0}
                  </TableCell>{" "}
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: index === 0 ? "primary.light" : "auto",
                      color: index === 0 ? "primary.main" : "auto",
                      borderRight: 1,
                      fontWeight: index === 0 ? "600" : "500",
                      borderColor: "greyScale.lighter",
                    }}
                  >
                    {row.rejected || 0}
                  </TableCell>{" "}
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: index === 0 ? "primary.light" : "auto",
                      color: index === 0 ? "primary.main" : "auto",
                      borderRight: 1,
                      fontWeight: index === 0 ? "600" : "500",
                      borderColor: "greyScale.lighter",
                    }}
                  >
                    {row.notCreated || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <Grid
          container
          sx={{
            width: "100%",
            borderRadius: "5px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Grid
            item
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
              justifyContent: { xs: "space-around" },
            }}
          >
            <Grid
              item
              sx={{
                width: {
                  xs: "90%",
                },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                m: "35px 0px 10px 0px",
              }}
            >
              {summaryInformation?.map((row: any, index: number) => {
                return (
                  <Grid
                    key={index}
                    sx={{
                      width: {
                        xs: "100%",
                        lg: "100%",
                      },
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      maxHeight: "35px",
                      mb: "50px",
                      color: "textPrimary.main",
                    }}
                    className="row"
                  >
                    <Typography
                      sx={{
                        width: "25%",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      {row?.name}
                    </Typography>
                    <Typography
                      sx={{
                        width: "25%",
                        fontSize: "13px",
                        color:
                          index === 0 ? "textPrimary.main" : "greyScale.main",
                        fontWeight: index === 0 ? "600" : "500",
                        textAlign: "center",
                      }}
                    >
                      {row?.overall || 0}
                    </Typography>
                    <Typography
                      sx={{
                        width: "25%",
                        fontSize: "13px",
                        color:
                          index === 0 ? "textPrimary.main" : "greyScale.main",
                        fontWeight: index === 0 ? "600" : "500",
                        textAlign: "center",
                      }}
                    >
                      {row?.completed || 0}
                    </Typography>
                    <Typography
                      sx={{
                        width: "25%",
                        fontSize: "13px",
                        color:
                          index === 0 ? "textPrimary.main" : "greyScale.main",
                        fontWeight: index === 0 ? "600" : "500",
                        textAlign: "center",
                      }}
                    >
                      {row?.pending || 0}
                    </Typography>
                    <Typography
                      sx={{
                        width: "25%",
                        fontSize: "13px",
                        color:
                          index === 0 ? "textPrimary.main" : "greyScale.main",
                        fontWeight: index === 0 ? "600" : "500",
                        textAlign: "center",
                      }}
                    >
                      {row?.rejected || 0}
                    </Typography>
                    <Typography
                      sx={{
                        width: "25%",
                        fontSize: "13px",
                        color:
                          index === 0 ? "textPrimary.main" : "greyScale.main",
                        fontWeight: index === 0 ? "600" : "500",
                        textAlign: "center",
                      }}
                    >
                      {row?.notCreated || 0}
                    </Typography>
                    {/* 
                    <Typography
                      sx={{
                        width: "25%",
                        fontSize: "13px",
                        color:
                          index === 0 ? "textPrimary.main" : "greyScale.main",
                        fontWeight: index === 0 ? "600" : "500",
                        textAlign: "center",
                      }}
                    >
                      {row?.na || 0}
                    </Typography> 
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid> */}
      </Box>
    </Grid>
  );
};

export default Summary;
