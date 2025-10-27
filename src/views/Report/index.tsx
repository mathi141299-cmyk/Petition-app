import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  IconButton,
  Typography,
  Box,
  MenuItem,
  debounce,
} from "@mui/material";
import { Select, TextField, DatePicker } from "../../components/basic";
import { CustomFilterElement } from "../../components/shared";
import PetitionReportList from "./petitions";
import { utils, writeFile } from "xlsx";
import { setCurrentPage } from "../../redux/slices/pagination";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { AutoComplete } from "../../components/basic";
import { ExcelIcon } from "../../assets/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  departmentDetails,
  getAllHabitationLists,
} from "../../services/petitionService";
import { panchayatDetails } from "../../services/petitionService";

const Report = () => {
  const styles = {
    textFieldStyle: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        height: "40px",
        borderRadius: "5px",
        paddingLeft: "8px",
        boxShadow: "none",
      },
    },

    selectStyle: {
      width: {
        xs: "160px",
        lg: "200px",
      },
      height: "40px",
      boxShadow: "none",
      borderRadius: "5px",
    },

    datePickerStyle: {
      width: {
        xs: "160px",
        lg: "200px",
      },
      "& .MuiOutlinedInput-root": {
        width: {
          xs: "160px",
          lg: "200px",
        },
        height: "40px",
        borderRadius: "5px",
        paddingLeft: "15px",
      },
    },
  };

  const initialStatusOptions = [
    { id: "Pending", value: "Pending" },
    { id: "Completed", value: "Completed" },
    { id: "Rejected", value: "Rejected" },
    { id: "Not created", value: "Not created" },
  ];

  const dispatch = useDispatch();

  const { authUser } = useSelector((state: RootState) => state.auth) as any;

  // console.log("authUser from Report", authUser);
  const [departmentOptions, setDepartmentOptions] = useState<any>([]);
  const [statusOptions, setStatusOptions] = useState<any>(initialStatusOptions);
  const [panchayatOptions, setPanchayatOptions] = useState<any>([]);

  const [reportData, setReportData] = useState<any>([]);
  const [isButtonLoading, setIsButtonLoading] = useState<any>(false);
  const [isGetAllData, setIsGetAllData] = useState<any>(false);
  const [isGenerateExcel, setIsGenerateExcel] = useState<any>(false);
  const [reportName, setReportName] = useState<any>("");

  const initialTotalReport = {
    totalBillsKodumudi: null,
    totalBillsGanapathipalayam: null,
    todayBillsKodumudi: null,
    todayBillsGanapathipalayam: null,
    totalAppointmentsModakurichi: null,
    totalAppointmentsSivagiri: null,
    todayAppointmentsModakurichi: null,
    todayAppointmentsSivagiri: null,
    totalMedicalCampCount: null,
    todayMedicalCampCount: null,
    totalSpiritualTourCount: null,
    todaySpiritualTourCount: null,
  };

  const initialFilters = {
    module: 1,
    petitionNo: "",
    status: null,
    department: null,
    department_input: "",
    panchayatId: null,
    panchayatId_input: "",
    fromDate: dayjs(),
    toDate: dayjs(),
  };

  const [filters, setFilters] = useState<any>(initialFilters);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;

    setFilters((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    dispatch(setCurrentPage({ key: "petitionReportList", value: 0 }));
  };

  const handleAutoCompleteChange = useCallback(
    (e: any, newValue: any, name: string) => {
      if (newValue === null) {
        return false;
      }

      if (name === "department") {
        setFilters((prev: any) => ({
          ...prev,
          [name]: newValue.name,
        }));
      }

      if (name === "panchayatId") {
        setFilters((prev: any) => ({
          ...prev,
          [name]: newValue.id,
        }));
      }

      dispatch(setCurrentPage({ key: "petitionReportList", value: 0 }));
    },
    []
  );

  const getAllHabitation = useCallback(
    debounce(async (search?: string | number) => {
      try {
        const data = {
          search: search,
          page: 1,
          size: "20",
        };
        return getAllHabitationLists(data).then((result: any) => {
          let data = result?.data;
          // console.log("data from getAllHabitationLists", data);

          setPanchayatOptions(data);
        });
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }, 300),
    []
  );

  const handleAutoCompleteInputChange = useCallback(
    (e: any, newInputValue: any, name: string) => {
      // console.log(
      //   "qwerty newInputValue, name from handleAutoCompleteInputChange",
      //   newInputValue,
      //   name
      // );

      // if (name === "department_input" && newInputValue === "") {
      //   return false;
      // }
      if (newInputValue === "" && name === "panchayatId_input") {
        setFilters((prev: any) => ({
          ...prev,
          [name]: newInputValue,
          panchayatId: null,
        }));

        dispatch(setCurrentPage({ key: "petitionReportList", value: 0 }));
      }

      if (name === "panchayatId_input") {
        setFilters((prev: any) => ({
          ...prev,
          [name]: newInputValue,
        }));
        getAllHabitation(newInputValue);
      }

      if (newInputValue === "" && name === "department_input") {
        setFilters((prev: any) => ({
          ...prev,
          [name]: newInputValue,
          department: null,
        }));

        dispatch(setCurrentPage({ key: "petitionReportList", value: 0 }));
      }

      if (name === "department_input") {
        setFilters((prev: any) => ({
          ...prev,
          [name]: newInputValue,
        }));
      }
    },
    []
  );

  const handleDateChange = (newValue: any, name: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [name]: newValue,
    }));
    dispatch(setCurrentPage({ key: "petitionReportList", value: 0 }));
  };

  const handleClearFilter = () => {
    setFilters(initialFilters);
  };

  const appointmentFilter = [
    {
      sx: {},
      children: (
        <TextField
          name="petitionNo"
          value={filters.petitionNo}
          label="Petition No"
          placeholder="150424/02/60"
          onChange={handleInputChange}
          sx={{
            ...styles.textFieldStyle,
          }}
        />
      ),
    },
    {
      // gridProps: { xs: 12, sm: 6, md: 2.4, xl: 2.4 },
      children: (
        <Select
          value={filters.status}
          onChange={(e) => handleInputChange(e)}
          placeholder="Select Status"
          options={statusOptions}
          label="Final Response Status"
          name="status"
          width="200px"
          sx={{
            ...styles.selectStyle,
          }}
        />
      ),
    },
    {
      // gridProps: { xs: 12, sm: 6, md: 2.4, xl: 2.4 },
      children: (
        <Grid
          sx={{
            "& .MuiFormControl-root": {
              height: "40px",
            },
            "& .MuiInputBase-root": {
              height: "40px",
              // padding: "6.5px 11.5px",
              // pr: "0px",
              borderRadius: "2px",
              pt: "2px",
              pb: "15px",
              // display: "flex",
              // justifyContent: "flex-start",
              // alignItems: "flex-start",
            },
            "& .MuiOutlinedInput-root": {
              // padding: "6.5px 11.5px",
              // pr: "0px",
              boxShadow: "none",
              pt: "2px",
              pb: "15px",
              borderRadius: "2px",
            },
          }}
        >
          <AutoComplete
            key={"autoCompleteClear"}
            label="Department"
            placeholder="Select Department"
            name="department"
            value={filters.department}
            inputValue={filters.department_input}
            disableClearable={false}
            freeSolo={false}
            onChange={(e: any, newValue: any) => {
              handleAutoCompleteChange(e, newValue, "department");
            }}
            onInputChange={(e: any, newInputValue: any) => {
              handleAutoCompleteInputChange(
                e,
                newInputValue,
                "department_input"
              );
            }}
            options={departmentOptions}
            optionName="name"
            sx={{
              width: {
                xs: "160px",
                lg: "200px",
              },
              boxSizing: "border-box",
              margin: 0,
              height: "40px",
            }}
          />
        </Grid>
      ),
    },
    {
      // gridProps: { xs: 12, sm: 6, md: 2.4, xl: 2.4 },
      children: (
        <Grid
          sx={{
            // "& .MuiAutocomplete-root": {
            //   height: "40px",
            // },
            // "& .MuiFormLabel-root": {
            //   display: "none",
            // },
            "& .MuiFormControl-root": {
              height: "40px",
            },
            "& .MuiInputBase-root": {
              height: "40px",
              // padding: "6.5px 11.5px",
              // pr: "0px",
              borderRadius: "2px",
              pt: "2px",
              pb: "15px",
              // display: "flex",
              // justifyContent: "flex-start",
              // alignItems: "flex-start",
            },
            "& .MuiOutlinedInput-root": {
              // padding: "6.5px 11.5px",
              // pr: "0px",
              boxShadow: "none",
              pt: "2px",
              pb: "15px",
              borderRadius: "2px",
            },
          }}
        >
          <AutoComplete
            key={"autoCompleteClear"}
            label={
              <span>
                Habitation
                <span style={{ color: "#F43F5E" }}> *</span>
              </span>
            }
            placeholder="Select Habitation"
            name="panchayatId"
            value={filters.panchayatId}
            inputValue={filters.panchayatId_input}
            disableClearable={false}
            freeSolo={false}
            onChange={(e: any, newValue: any) => {
              handleAutoCompleteChange(e, newValue, "panchayatId");
            }}
            onInputChange={(e: any, newInputValue: any) => {
              handleAutoCompleteInputChange(
                e,
                newInputValue,
                "panchayatId_input"
              );
            }}
            options={panchayatOptions}
            optionName="name"
            sx={{
              width: {
                xs: "160px",
                lg: "200px",
              },
              boxSizing: "border-box",
              margin: 0,
              height: "40px",
            }}
            renderOption={(props: any, option: any) => {
              return (
                <MenuItem
                  key={option.id}
                  sx={{
                    "&:hover, &.Mui-focused:hover": {
                      color: "backgroundPrimary.main",
                      backgroundColor: "primary.main",
                    },
                    borderRadius: "5px",
                    p: "15px",
                    m: "0 5px",
                    gap: 10,
                    width: "400px",
                  }}
                  {...props}
                >
                  <Box>{option?.panchayat?.name}</Box>
                  <Box
                    sx={{
                      width: "432px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    ( {option?.name})
                  </Box>
                </MenuItem>
              );
            }}
            getOptionLabel={(option: any) => option?.name}
            filterOptions={(options: any, state: any) => {
              const inputValue = state?.inputValue?.toLowerCase();

              return options?.filter(
                (option: any) =>
                  option?.name?.toLowerCase()?.includes(inputValue) ||
                  option?.panchayat?.name?.toLowerCase()?.includes(inputValue)
              );
            }}
          />
        </Grid>
      ),
    },
    {
      // gridProps: { xs: 12, sm: 6, md: 2.4, xl: 2.4 },
      children: (
        <DatePicker
          name="fromDate"
          label="From Date"
          value={filters.fromDate}
          disableFuture={true}
          maxDate={filters.toDate}
          onChange={(newValue: any) => handleDateChange(newValue, "fromDate")}
          sx={{ ...styles.datePickerStyle }}
        />
      ),
    },
    {
      // gridProps: { xs: 12, sm: 6, md: 2.4, xl: 2.4 },
      children: (
        <DatePicker
          name="toDate"
          label="To Date"
          value={filters.toDate}
          disableFuture={true}
          minDate={filters.fromDate}
          onChange={(newValue: any) => handleDateChange(newValue, "toDate")}
          sx={{ ...styles.datePickerStyle }}
        />
      ),
    },
  ];

  const getAllDepartments = useCallback(async () => {
    try {
      departmentDetails().then((result: any) => {
        let data = result?.data;
        const departmentsList = data?.map((uniqueData: any) => {
          return {
            id: uniqueData.id,
            name: uniqueData.name,
          };
        });

        setDepartmentOptions(departmentsList);
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, []);

  const getAllPanchayats = useCallback(async () => {
    try {
      panchayatDetails().then((result: any) => {
        let data = result?.data;

        setPanchayatOptions(data);
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, []);

  useEffect(() => {
    getAllDepartments();
    getAllHabitation();
  }, []);

  const generateExcel = () => {
    setIsButtonLoading(true);

    const data = reportData;
    // console.log("mnmnmn generateExcel gets called", data);

    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet(data);

    utils.book_append_sheet(wb, ws, "Sheet1");

    writeFile(wb, `${reportName}.xlsx`);

    setIsButtonLoading(false);
    setIsGenerateExcel(false);
    setIsGetAllData(false);
  };

  useEffect(() => {
    if (isGenerateExcel && reportData?.length > 0) {
      generateExcel();
    } else {
      setIsGenerateExcel(false);
      setIsGetAllData(false);
    }
  }, [reportData]);

  const CustomComponent = () => {
    return (
      <Grid
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: "2px 0",
          mt: { xs: "20px", lg: "0px" },
        }}
      >
        {/* {authUser?.name === "Admin" && authUser.userName === "admin" ? ( */}
        <IconButton
          onClick={() => {
            if (filters.module !== null) {
              setIsGetAllData(true);
              setIsGenerateExcel(true);
            }
          }}
          sx={{ cursor: filters.module !== null ? "pointer" : "not-allowed" }}
        >
          <ExcelIcon />
        </IconButton>
        {/* ) : null} */}
      </Grid>
    );
  };

  return (
    <Grid sx={{ width: "auto", mb: "100px" }}>
      <Grid sx={{ mb: 3 }}>
        <Typography variant="h2" color="initial">
          Petition Report
        </Typography>
      </Grid>

      <CustomFilterElement
        data={appointmentFilter}
        isSearchEnabled={false}
        clearFilter={handleClearFilter}
        customComponent={<CustomComponent />}
        filterComponentWidth={{
          xs: "100%",
          md: "90%",
          lg: "90%",
        }}
        clearFilterDivWidth={{
          xs: "160px",
          lg: "20px",
        }}
      />
      {filters.module === 1 && (
        <PetitionReportList
          filters={{
            module: filters.module,
            petitionNo: filters.petitionNo,
            status: filters.status,
            panchayatId: filters.panchayatId,
            // panchayat_input: filters.panchayat_input,
            department: filters.department
              ? encodeURIComponent(filters.department)
              : filters.department,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
          }}
          setReportData={setReportData}
          isGetAllData={isGetAllData}
          setReportName={setReportName}
        />
      )}
    </Grid>
  );
};

export default Report;
