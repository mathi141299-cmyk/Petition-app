import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Grid,
  Typography,
  IconButton,
  debounce,
  Menu,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RouteUrls } from "../../../constants/routes";
import { RootState } from "../../../redux/store";
import {
  DeleteIcon,
  EditIcon,
  FieldVisitIcon,
  LocationIcon,
  PrinterIcon,
  ViewIcon,
} from "../../../assets/icons";
import { TextField, Sort, DatePicker, Select } from "../../../components/basic";
import { Link } from "react-router-dom";
import { DataTable } from "../../../components/shared";
import CustomFilterElement from "../../../components/shared/customFilter";
import moment from "moment";
import { GridMoreVertIcon } from "@mui/x-data-grid";
import { getFieldVisitsList } from "../../../services/fieldvisitService";
import { getLettersList } from "../../../services/letterService";
import { setCurrentPage } from "../../../redux/slices/pagination";

const LetterList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    fieldVisitUrl,
    createUrl,
    editUrl,
    viewUrl,
    finalResponseUrl,
    letterUrl,
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

  const { LetterList } = useSelector((state: RootState) => state.pagination);

  const [isFieldSort, setIsFieldSort] = useState<boolean>(false);
  const [sortedField, setSortedField] = useState<{
    order: string | null;
    field: string | null;
  }>({
    order: null,
    field: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleSorting = (field: string) => {
    setIsFieldSort(!isFieldSort);

    setSortedField({ field: field, order: isFieldSort ? "ASC" : "DESC" });
  };

  const initialFilters = {
    petitionNo: "",
    letterStatus: "",
    date: null,
  };
  const [filters, setFilters] = useState<any>(initialFilters);

  const TableActions = ({ row }: any) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          textAlign: "center",
        }}
      >
        <Link
          to={`${letterUrl}/${row.id}`}
          style={{
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          <IconButton>
            <ViewIcon />
          </IconButton>
        </Link>
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
          onClick={() => handleSorting("petitionNo")}
        >
          <Typography variant="h5" fontSize={14}>
            Petition No
          </Typography>
          <Sort
            ascendingActive={
              sortedField.field === "petitionNo" && sortedField.order === "ASC"
                ? true
                : false
            }
            descendingActive={
              sortedField.field === "petitionNo" && sortedField.order === "DESC"
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
          onClick={() => handleSorting("letter_status")}
        >
          <Typography variant="h5" fontSize={14}>
            Status
          </Typography>
          <Sort
            ascendingActive={
              sortedField.field === "letter_status" &&
              sortedField.order === "ASC"
                ? true
                : false
            }
            descendingActive={
              sortedField.field === "letter_status" &&
              sortedField.order === "DESC"
                ? true
                : false
            }
          />
        </Grid>
      ),
      renderCell: ({ row }: any) => (
        <Typography variant="h5">{row?.status}</Typography>
      ),
      minWidth: 120,
      sortable: false,
    },
    {
      field: "date",
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
          onClick={() => handleSorting("date")}
        >
          <Typography variant="h5" fontSize={14}>
            Date
          </Typography>
          <Sort
            ascendingActive={
              sortedField.field === "date" && sortedField.order === "ASC"
                ? true
                : false
            }
            descendingActive={
              sortedField.field === "date" && sortedField.order === "DESC"
                ? true
                : false
            }
          />
        </Grid>
      ),
      renderCell: ({ row }: any) => (
        <Typography variant="h5">
          {row?.date ? moment(row?.date).format("DD/MM/YYYY") : ""}
        </Typography>
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

    setFilters(() => ({
      ...filters,
      [name]: value,
    }));
    dispatch(setCurrentPage({ key: "LetterList", value: 0 }));
  };
  const handleDateChange = (newValue: any) => {
    setFilters(() => ({
      ...filters,
      date: newValue,
    }));
    dispatch(setCurrentPage({ key: "LetterList", value: 0 }));
  };

  const appointmentFilter = [
    {
      // gridProps: { xs: 12, sm: 6, md: 2.4, xl: 2.4 },
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
        <Select
          value={filters.letterStatus}
          onChange={(e) => handleInputChange(e)}
          placeholder="Select Status"
          options={[
            { id: "Pending", value: "Pending" },
            { id: "Completed", value: "Completed" },
            // { id: "Not Applicable", value: "Not Applicable" },
          ]}
          label="Status"
          name="letterStatus"
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
    {
      children: (
        <DatePicker
          formControlStyle={{
            "& .MuiOutlinedInput-root": {
              height: "40px",
              borderRadius: "5px",
            },
          }}
          name="date"
          value={filters.date}
          label="Date"
          onChange={(newValue: any) => handleDateChange(newValue)}
          sx={{
            width: "210px",
          }}
        />
      ),
    },
  ];

  // const initialRows: any = [
  //   {
  //     id: 1,
  //     petitionNo: "150424 / 02 / 60",
  //     departmentName: "Educational",
  //     date: "12/02/23",
  //   },
  //   {
  //     id: 2,
  //     petitionNo: "150424 / 02 / 60",
  //     departmentName: "PWD",
  //     date: "12/02/23",
  //   },
  // ];

  const [list, setList] = useState({
    count: 0,
    rows: [],
  });

  const getAllFieldVisitsList = async (data: any) => {
    setIsLoading(true);
    await getLettersList(data)
      .then((res: any) => {
        if (res?.data) {
          setList({
            ...list,
            rows: res?.data?.rows?.map((row: any, index: number) => {
              return { ...row, sNo: index + 1 };
            }),
            count: res?.data?.count,
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
      getAllFieldVisitsList(data);
    }, 300),
    []
  );
  useEffect(() => {
    const data = {
      ...filters,
      date: filters.date
        ? moment(filters?.date?.$d).format("YYYY-MM-DD")
        : null,
      page: LetterList.page + 1,
      size: LetterList.pageSize,
      column: sortedField.field,
      order: sortedField.order,
    };
    debouncedGetCustomerList(data);
  }, [filters, LetterList, sortedField]);

  const handleClearFilter = () => {
    setFilters(initialFilters);
  };

  return (
    <Grid>
      <Grid sx={{ mb: 3 }}>
        <Typography variant="h2" color="initial">
          Letter List
        </Typography>
      </Grid>
      <CustomFilterElement
        data={appointmentFilter}
        isSearchEnabled={true}
        // addButtonTitle="+ Add Final Response"
        // onAddButtonClick={`${finalResponseUrl}${createUrl}`}
        clearFilter={handleClearFilter}
      />
      <DataTable
        columns={columns}
        getRowId={(row: any) => `${String(row.sNo)}`}
        rows={list.rows}
        pageCount={list?.count}
        currentPage={"LetterList"}
      />
    </Grid>
  );
};

export default LetterList;
