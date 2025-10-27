import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Grid,
  Typography,
  IconButton,
  debounce,
  Menu,
  MenuItem,
  Tooltip,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RouteUrls } from "../../../constants/routes";
import { RootState } from "../../../redux/store";
import {
  ViewIcon,
  ListFieldVisit,
  ListLetterIcon,
  ListPrintIcon,
  DeleteIconIconInAction,
} from "../../../assets/icons";
import {
  TextField,
  Sort,
  Select,
  AutoComplete,
} from "../../../components/basic";
import { Link } from "react-router-dom";
import { DataTable } from "../../../components/shared";
import CustomFilterElement from "../../../components/shared/customFilter";
import moment from "moment";
import { GridMoreVertIcon } from "@mui/x-data-grid";
import {
  deletePetitions,
  departmentDetails,
  getPetitionsList,
} from "../../../services/petitionService";
import { getPetitionById } from "../../../services/petitionService";
import { useReactToPrint } from "@kvnyu/react-to-print";
import PetitionPrint from "../Print";
import { setCurrentPage } from "../../../redux/slices/pagination";
import {
  setSnackBarFailed,
  setSnackBarSuccess,
} from "../../../redux/slices/snackbar";
import {
  letterPageConst,
  petitionPageConst,
} from "../../../constants/displayText";
import ConfirmationDialog from "../../../components/shared/confirmationDialog";
import { deleteLetterFormat } from "../../../services/letterService";

const PetitionsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    petitionListUrl,
    createUrl,
    editUrl,
    viewUrl,
    fieldVisitUrl,
    letterUrl,
    finalResponseUrl,
    listUrl,
  } = RouteUrls;

  const style = {
    textFieldStyle: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        height: "40px",
        borderRadius: "5px",
        paddingLeft: "8px",
        boxShadow: "none",
      },
    },
    addButton: {
      textTransform: "none",
      height: "40px",
      width: "auto",
      maxWidth: "max-content",
      backgroundColor: "primary.main",
      color: "#FFFFFF",
      border: "none",
      fontSize: "14px",
      weight: 400,
    },
  };

  const { petitionsList } = useSelector((state: RootState) => state.pagination);

  const [isFieldSort, setIsFieldSort] = useState<boolean>(false);
  const [sortedField, setSortedField] = useState<{
    order: string | null;
    field: string | null;
  }>({
    order: null,
    field: null,
  });
  const [departments, setDepartments] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState<boolean>(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [idToBeDeleted, setIdToBeDeleted] = useState<any>(null);
  const [isPetitionDelete, setIsPetitionDelete] = useState(false);

  const handleSorting = (field: string) => {
    setIsFieldSort(!isFieldSort);

    setSortedField({ field: field, order: isFieldSort ? "ASC" : "DESC" });
  };

  const initialFilters = {
    petitionNo: "",
    mobile: "",
    petitionerName: "",
    finalResponseStatus: "",
    department: null,
    department_input: "",
  };

  const [filters, setFilters] = useState<any>(initialFilters);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [petitionDetails, setPetitionDetails] = useState({});

  const printRef = useRef(null);

  const ITEM_HEIGHT = 48;

  const handleCancelPrint = async () => {
    navigate(`${petitionListUrl}${listUrl}`);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => handleCancelPrint(),
  });

  const handleSubmit = () => {
    handlePrint();
    setIsSubmit(false);
  };

  useEffect(() => {
    if (isSubmit) {
      handleSubmit();
    }
  }, [isSubmit]);

  const handlePrintChange = async (row: any) => {
    try {
      await getPetitionById(row.id).then((res: any) => {
        // console.log("data from handlePrintChange", res.data);

        const data = res?.data;
        setPetitionDetails(data);

        setIsSubmit(true);
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const TableActions = ({ row }: any) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: any) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <div>
        <IconButton
          aria-label="more"
          aria-controls={open ? "long-menu" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <GridMoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right", // Adjust as needed
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right", // Adjust as needed
          }}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "19ch",
              marginRight: "30px",
            },
          }}
          sx={{ gap: 2 }}
        >
          <Link
            to={`${petitionListUrl}/${row.id}`}
            style={{
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <MenuItem sx={{ gap: 2 }}>
              <ViewIcon />{" "}
              <Typography variant="h5" color="initial">
                View
              </Typography>
            </MenuItem>
          </Link>
          {row.isFieldVisitRequired == 1 && (
            <Link
              to={`${fieldVisitUrl}/${row?.fieldVisitId}`}
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <MenuItem onClick={handleClose} sx={{ gap: 2 }}>
                <ListFieldVisit />{" "}
                <Typography variant="h5" color="initial">
                  Field Visit
                </Typography>
              </MenuItem>
            </Link>
          )}
          {row?.isLetterRequired == 1 && (
            <Link
              to={`${letterUrl}/${row?.letterId}`}
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <MenuItem onClick={handleClose} sx={{ gap: 2 }}>
                <ListLetterIcon />{" "}
                <Typography variant="h5" color="initial">
                  Letters
                </Typography>
              </MenuItem>
            </Link>
          )}
          <MenuItem
            onClick={() => {
              handlePrintChange(row);
              // ("");
            }}
            sx={{ gap: 2 }}
          >
            <ListPrintIcon />
            <Typography variant="h5" color="initial">
              Consolidated Print
            </Typography>{" "}
          </MenuItem>

          <MenuItem
            onClick={() => {
              setIsConfirmationDialogOpen(true);
              setIdToBeDeleted(row?.id);
            }}
            sx={{ gap: 1.5, ml: "-2px" }}
          >
            <DeleteIconIconInAction />{" "}
            <Typography variant="h5" color="initial">
              Delete
            </Typography>
          </MenuItem>
        </Menu>
      </div>
    );
  };

  const columns: any[] = [
    {
      field: "petitionNo",
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
          onClick={() => handleSorting("petition_no")}
        >
          <Typography variant="h5" fontSize={14}>
            Petition No
          </Typography>
          <Sort
            ascendingActive={
              sortedField.field === "petition_no" && sortedField.order === "ASC"
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
        <Typography variant="h5">{row?.petitionNo}</Typography>
      ),
      minWidth: 120,
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
        <Typography variant="h5">{row?.name}</Typography>
      ),
      minWidth: 120,
      sortable: false,
    },
    {
      field: "mobile",
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
        <Typography variant="h5">{row?.mobile}</Typography>
      ),
      minWidth: 120,
      sortable: false,
    },
    {
      field: "dateAndTime",
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
      minWidth: 120,
      sortable: false,
    },
    {
      field: "habitation",
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
          onClick={() => handleSorting("habitationId")}
        >
          <Typography variant="h5" fontSize={14}>
            Habitation
          </Typography>
          <Sort
            ascendingActive={
              sortedField.field === "habitationId" &&
              sortedField.order === "ASC"
                ? true
                : false
            }
            descendingActive={
              sortedField.field === "habitationId" &&
              sortedField.order === "DESC"
                ? true
                : false
            }
          />
        </Grid>
      ),
      renderCell: ({ row }: any) => (
        <Typography variant="h5">{row?.habitation}</Typography>
      ),
      minWidth: 120,
      sortable: false,
    },
    {
      field: "fieldVisitStatus",
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
          onClick={() => handleSorting("fieldVisitStatus")}
        >
          <Typography variant="h5" fontSize={14}>
            Field Status
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
          {row?.fieldVisitStatus ? row?.fieldVisitStatus : "Not Required"}
          {/* {} */}
        </Typography>
      ),
      minWidth: 120,
      sortable: false,
    },
    {
      field: "Letter",
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
        <Typography variant="h5">
          {/* {row?.petitionFieldVisit?.fieldVisit?.isLetterRequired == 1
            ? "Pending"
            : "Not Required"} */}

          {/* {row?.letterStatus?.letter?.length !== 0
            ? row?.letterStatus
              ? row?.letterStatus[0]?.letter?.letterStatus
              : null
            : "Not Required"} */}
          {row?.letterStatus ? row?.letterStatus : "Not Required"}
        </Typography>
      ),
      minWidth: 120,
      sortable: false,
    },
    {
      field: "finalResponseStatus",
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
        <Typography variant="h5">
          {/* {row?.finalResponsePetition.length !== 0
            ? row?.finalResponsePetition[0]?.finalResponse?.status
            : "Pending"} */}
          {row?.finalResponseStatus}
        </Typography>
      ),
      minWidth: 120,
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
              sortedField.field === "department" && sortedField.order === "ASC"
                ? true
                : false
            }
            descendingActive={
              sortedField.field === "department" && sortedField.order === "DESC"
                ? true
                : false
            }
          /> */}
        </Grid>
      ),
      renderCell: ({ row }: any) => (
        <Tooltip
          title={
            <Box sx={{ fontSize: "14px" }}>
              {" "}
              {/* Adjust the font size as needed */}
              {row?.department}
            </Box>
          }
          arrow
          enterDelay={500}
          leaveDelay={200}
        >
          <Typography variant="h5">
            {row?.department}
            {/* {row?.department} */}
          </Typography>
        </Tooltip>
      ),
      minWidth: 120,
      sortable: false,
    },
    {
      field: "actions",
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
            Actions
          </Typography>
        </Grid>
      ),
      renderCell: ({ row }: any) => {
        return <TableActions row={row} />;
      },
      minWidth: 120,
      sortable: false,
    },
  ];

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    // console.log("name, value", name, value);

    if (name === "department") {
      setFilters(() => ({
        ...filters,
        [name]: value.name,
      }));
    } else {
      setFilters(() => ({
        ...filters,
        [name]: value,
      }));
    }
    dispatch(setCurrentPage({ key: "petitionsList", value: 0 }));
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
      dispatch(setCurrentPage({ key: "petitionsList", value: 0 }));
    },
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

        // dispatch(setCurrentPage({ key: "petitionReportList", value: 0 }));
      }

      if (name === "panchayatId_input") {
        setFilters((prev: any) => ({
          ...prev,
          [name]: newInputValue,
        }));
      }

      if (newInputValue === "" && name === "department_input") {
        setFilters((prev: any) => ({
          ...prev,
          [name]: newInputValue,
          department: null,
        }));

        // dispatch(setCurrentPage({ key: "petitionReportList", value: 0 }));
      }

      if (name === "department_input") {
        setFilters((prev: any) => ({
          ...prev,
          [name]: newInputValue,
        }));
      }

      dispatch(setCurrentPage({ key: "petitionsList", value: 0 }));
    },
    []
  );

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
            ...style.textFieldStyle,
          }}
        />
      ),
    },
    {
      children: (
        <TextField
          name="mobile"
          value={filters.mobile}
          label="Mobile"
          placeholder="9623541896"
          onChange={handleInputChange}
          sx={{
            ...style.textFieldStyle,
          }}
        />
      ),
    },
    {
      children: (
        <TextField
          name="petitionerName"
          value={filters.petitionerName}
          label="Petitioner Name"
          placeholder="jack"
          onChange={handleInputChange}
          sx={{
            ...style.textFieldStyle,
          }}
        />
      ),
    },
    {
      children: (
        // <Select
        //   label="Department"
        //   name="department"
        //   value={filters.department}
        //   placeholder="Select Department"
        //   options={departments}
        //   onChange={handleInputChange}
        //   width="205px"
        //   selectedType="object"
        //   sx={{
        //     width: "205px",
        //     height: "40px",
        //     borderRadius: "5px",
        //   }}
        // />
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
            options={departments}
            optionName="name"
            sx={{
              width: {
                xs: "160px",
                lg: "200px",
              },
              boxSizing: "border-box",
              margin: 0,
              height: "35px",
            }}
          />
        </Grid>
        // <TextField
        //   name="department"
        //   value={filters.department}
        //   label="Department"
        //   placeholder="Education"
        //   onChange={handleInputChange}
        //   sx={{
        //     ...style.textFieldStyle,
        //   }}
        // />
      ),
    },
    {
      sx: {},
      children: (
        <Select
          value={filters.finalResponseStatus}
          onChange={(e) => handleInputChange(e)}
          placeholder="Select Status"
          options={[
            { id: "Pending", value: "Pending" },
            { id: "Completed", value: "Completed" },
            { id: "Rejected", value: "Rejected" },
            { id: "Not created", value: "Not created" },
          ]}
          label="Final Response Status"
          name="finalResponseStatus"
          width="200px"
          sx={{
            width: {
              xs: "160px",
              lg: "200px",
            },
            height: "40px",
            boxShadow: "none",
            borderRadius: "5px",
          }}
        />
      ),
    },
  ];

  // const initialRows: any = [
  //   {
  //     id: 1,
  //     petitionNo: "150424 / 02 / 60",
  //     name: "jack",
  //     mobile: 989898998,
  //     date: "25/12/2024",
  //     village: "kattur",
  //     fieldStatus: "Not required",
  //     letter: "Education",
  //     status: "Completed",
  //     department: "Education",
  //   },
  //   {
  //     id: 2,
  //     petitionNo: "150424 / 02 / 60",
  //     name: "jack",
  //     mobile: 989898998,
  //     date: "25/12/2024",
  //     village: "kattur",
  //     letter: "Water",
  //     fieldStatus: "Not required",
  //     status: "Completed",
  //     department: "Education",
  //   },
  // ];

  const [list, setList] = useState({
    count: 0,
    rows: [],
  });

  const getAllPetitionsList = async (data: any) => {
    setIsLoading(true);
    await getPetitionsList(data)
      .then((res: any) => {
        if (res?.data?.petitions) {
          setList({
            ...list,
            // rows: res?.data?.petitions.rows,
            rows: res?.data?.formattedPetitions,
            count: res?.data?.rowCount,
          });
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const debouncedGetCustomerList = useCallback(
    debounce((data: any) => {
      getAllPetitionsList(data);
    }, 300),
    []
  );

  useEffect(() => {
    const data = {
      ...filters,
      // date: filters.date
      //   ? moment(filters?.date?.$d).format("YYYY-MM-DD")
      //   : null,
      page: petitionsList.page + 1,
      size: petitionsList.pageSize,
      column: sortedField.field,
      order: sortedField.order,
      department: filters.department
        ? encodeURIComponent(filters.department)
        : filters.department,
    };
    if (
      (filters?.department === null && filters?.department_input === "") ||
      (filters?.department !== null && filters?.department_input !== "")
    ) {
      debouncedGetCustomerList(data);
    }
  }, [filters, petitionsList, sortedField, isPetitionDelete]);

  const handleClearFilter = () => {
    setFilters(initialFilters);
  };

  const getAllDepartments = useCallback(async () => {
    try {
      departmentDetails().then((result: any) => {
        let data = result?.data;

        setDepartments(data);
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, []);

  useEffect(() => {
    getAllDepartments();
  }, []);

  const onConfirmationDialogClose = () => {
    setIsConfirmationDialogOpen(false);
  };

  const handleDeletePetition = async (data: any) => {};
  const handleConfirmPetitionDelete = async () => {
    if (idToBeDeleted === null) {
      return false;
    } else {
      deletePetition(idToBeDeleted);
    }
  };

  const deletePetition = async (id: any) => {
    try {
      // setIsPageLoader(true);
      await deletePetitions(id).then((result: any) => {
      
        dispatch(
          setSnackBarSuccess({
            snackBarMessage: petitionPageConst.PETITION_DELETED as string,
          })
        );
        // getLetterFormatsByLetterId();
        // setIsPageLoader(false);
        // console.log("deletePetition");
        // debouncedGetCustomerList();
        setIsConfirmationDialogOpen(false);
        setIsButtonLoading(false);
        setIdToBeDeleted(null);
        setIsPetitionDelete(!isPetitionDelete);
      });
    } catch (error: any) {
      console.log("Error occurred:", error);
      // setIsPageLoader(false);
      setIsConfirmationDialogOpen(false);
      setIsButtonLoading(false);
      setIdToBeDeleted(null);
      setIsPetitionDelete(!isPetitionDelete);
      // setIsLetterFormatDelete(false);
      dispatch(
        setSnackBarFailed({
          snackBarMessage: error?.response?.data?.message,
        })
      );
    }
  };
  return (
    <Grid>
      <Grid sx={{ mb: 3 }}>
        <Typography variant="h2" color="initial">
          Petition List
        </Typography>
      </Grid>
      <CustomFilterElement
        data={appointmentFilter}
        isSearchEnabled={true}
        addButtonTitle="+ Add"
        onAddButtonClick={`${petitionListUrl}${createUrl}`}
        clearFilter={handleClearFilter}
      />
      <DataTable
        columns={columns}
        getRowId={(row: any) => `${String(row.id)}`}
        rows={list.rows}
        pageCount={list?.count}
        currentPage={"petitionsList"}
        loading={isLoading}
      />
      <Grid sx={{ display: "none" }}>
        <PetitionPrint printRef={printRef} petitionDetails={petitionDetails} />
      </Grid>
      <ConfirmationDialog
        open={isConfirmationDialogOpen}
        title="Deleting this petition will also remove its associated field visits, letters, and final responses. Are you sure you want to delete?"
        handleClick={handleConfirmPetitionDelete}
        onClose={onConfirmationDialogClose}
        loading={isButtonLoading}
        maxWidth="sm"
        width="500px"
      />
    </Grid>
  );
};

export default PetitionsList;
