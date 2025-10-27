import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { getDashboardDetails } from "../../services/dashboard";
import Summary from "./Summary";

const Dashboard = () => {
  const initialTotalReport = {
    petitionOverallCount: null,
    petitionCompletedCount: null,
    petitionPendingCount: null,
    petitionRejectedCount: null,
    fieldVisitOverallCount: null,
    fieldVisitCompletedCount: null,
    fieldVisitPendingCount: null,
    fieldVisitRejectedCount: null,
    departmentLettersOverallCount: null,
    departmentLettersCompletedCount: null,
    departmentLettersPendingCount: null,
    departmentLettersRejectedCount: null,
    departmentLettersNACount: null,
  };

  const [totalReportData, setTotalReportData] =
    useState<any>(initialTotalReport);

  const getTotalReport = async () => {
    try {
      await getDashboardDetails().then((result: any) => {
        // console.log("mnmnmn result from getTotalReport", result);
        let data = result?.data;

        setTotalReportData(data);
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    getTotalReport();
  }, []);

  return (
    <Grid sx={{ width: "auto", mb: "100px" }}>
      <Summary totalReportData={totalReportData} />
    </Grid>
  );
};

export default Dashboard;
