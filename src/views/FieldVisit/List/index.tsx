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
import { ViewIcon } from "../../../assets/icons";
import { TextField, Sort, DatePicker, Select } from "../../../components/basic";
import { Link } from "react-router-dom";
import { DataTable } from "../../../components/shared";
import CustomFilterElement from "../../../components/shared/customFilter";
import moment from "moment";
import { GridMoreVertIcon } from "@mui/x-data-grid";
import { getFieldVisitsList } from "../../../services/fieldvisitService";
import { setCurrentPage } from "../../../redux/slices/pagination";

const FieldVisitList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { fieldVisitUrl, createUrl, editUrl, viewUrl } = RouteUrls;

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

  const { FieldVisitList } = useSelector(
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
  const [isLoading, setIsLoading] = useState(true);

  const handleSorting = (field: string) => {
    setIsFieldSort(!isFieldSort);

    setSortedField({ field: field, order: isFieldSort ? "ASC" : "DESC" });
  };

  const initialFilters = {
    petitionNo: "",
    mobile: "",
    petitionerName: "",
    fieldVisitStatus: null,
    visitDate: null,
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
          to={`${fieldVisitUrl}/${row.id}`}
          style={{
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          <IconButton>
            <ViewIcon />
          </IconButton>
        </Link>
        {/* <Link
          to={``}
          style={{
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          <IconButton>
            <LocationIcon />
          </IconButton>
        </Link> */}
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
      field: "name",
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
          onClick={() => handleSorting("petitionerName")}
        >
          <Typography variant="h5" fontSize={14}>
            Name
          </Typography>
          <Sort
            ascendingActive={
              sortedField.field === "petitionerName" &&
              sortedField.order === "ASC"
                ? true
                : false
            }
            descendingActive={
              sortedField.field === "petitionerName" &&
              sortedField.order === "DESC"
                ? true
                : false
            }
          />
        </Grid>
      ),
      renderCell: ({ row }: any) => (
        <Typography variant="h5">{row?.petitionerName}</Typography>
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
        <Typography variant="h5"> {row?.mobile}</Typography>
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
          onClick={() => handleSorting("visit_date")}
        >
          <Typography variant="h5" fontSize={14}>
            Visit Date
          </Typography>
          <Sort
            ascendingActive={
              sortedField.field === "visit_date" && sortedField.order === "ASC"
                ? true
                : false
            }
            descendingActive={
              sortedField.field === "visit_date" && sortedField.order === "DESC"
                ? true
                : false
            }
          />
        </Grid>
      ),
      renderCell: ({ row }: any) => (
        <Typography variant="h5">
          {" "}
          {row?.date ? moment(row?.date)?.format("DD/MM/YYYY") : ""}
        </Typography>
      ),
      minWidth: 120,
      sortable: false,
    },
    {
      field: "visitBy",
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
          onClick={() => handleSorting("visit_by")}
        >
          <Typography variant="h5" fontSize={14}>
            Visit By
          </Typography>
          <Sort
            ascendingActive={
              sortedField.field === "visit_by" && sortedField.order === "ASC"
                ? true
                : false
            }
            descendingActive={
              sortedField.field === "visit_by" && sortedField.order === "DESC"
                ? true
                : false
            }
          />
        </Grid>
      ),
      renderCell: ({ row }: any) => (
        <Typography variant="h5"> {row?.visitBy}</Typography>
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
          onClick={() => handleSorting("field_visit_status")}
        >
          <Typography variant="h5" fontSize={14}>
            Status
          </Typography>
          <Sort
            ascendingActive={
              sortedField.field === "field_visit_status" &&
              sortedField.order === "ASC"
                ? true
                : false
            }
            descendingActive={
              sortedField.field === "field_visit_status" &&
              sortedField.order === "DESC"
                ? true
                : false
            }
          />
        </Grid>
      ),
      renderCell: ({ row }: any) => (
        <Typography variant="h5"> {row?.status}</Typography>
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
          onClick={() => handleSorting("PanchayatId")}
        >
          <Typography variant="h5" fontSize={14}>
            Panchayat
          </Typography>
          <Sort
            ascendingActive={
              sortedField.field === "PanchayatId" && sortedField.order === "ASC"
                ? true
                : false
            }
            descendingActive={
              sortedField.field === "PanchayatId" &&
              sortedField.order === "DESC"
                ? true
                : false
            }
          />
        </Grid>
      ),
      renderCell: ({ row }: any) => (
        <Typography variant="h5">{row?.panchayat}</Typography>
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
    dispatch(setCurrentPage({ key: "FieldVisitList", value: 0 }));
  };
  const handleDateChange = (newValue: any) => {
    setFilters(() => ({
      ...filters,
      visitDate: newValue,
    }));
    dispatch(setCurrentPage({ key: "FieldVisitList", value: 0 }));
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
        <Select
          value={filters.fieldVisitStatus}
          onChange={(e) => handleInputChange(e)}
          placeholder="Select Status"
          options={[
            { id: "Pending", value: "Pending" },
            { id: "Completed", value: "Completed" },
          ]}
          label="Status"
          name="fieldVisitStatus"
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
          name="visitDate"
          value={filters.visitDate}
          label="Visit Date"
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
  //     name: "jack",
  //     mobile: 989898998,
  //     date: "25/12/2024",
  //     panchayat: "arachalur",
  //     habitation: "kattur",
  //   },
  //   {
  //     id: 2,
  //     petitionNo: "150424 / 02 / 60",
  //     name: "jack",
  //     mobile: 989898998,
  //     date: "25/12/2024",
  //     village: "kattur",
  //     panchayat: "arachalur",
  //     habitation: "kattur",
  //   },
  // ];

  // const [list, setList] = useState({
  //   count: 0,
  //   rows: initialRows,
  // });

  const [list, setList] = useState({
    count: 0,
    rows: [],
  });

  const getAllFieldVisitsList = async (data: any) => {
    setIsLoading(true);
    await getFieldVisitsList(data)
      .then((res: any) => {
        if (res?.data) {
          setList({
            ...list,
            rows: res?.data?.rows?.map((ele: any, index: number) => ({
              ...ele,
              index,
            })),
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
      visitDate: filters.visitDate
        ? moment(filters?.visitDate?.$d).format("YYYY-MM-DD")
        : null,
      page: FieldVisitList.page + 1,
      size: FieldVisitList.pageSize,
      column: sortedField.field,
      order: sortedField.order,
    };
    debouncedGetCustomerList(data);
  }, [filters, FieldVisitList, sortedField]);

  const handleClearFilter = () => {
    setFilters(initialFilters);
  };

  return (
    <Grid>
      <Grid sx={{ mb: 3 }}>
        <Typography variant="h2" color="initial">
          Field Visit List
        </Typography>
      </Grid>
      <CustomFilterElement
        data={appointmentFilter}
        isSearchEnabled={true}
        // addButtonTitle="+ Add Petition"
        // onAddButtonClick={`${fieldVisitUrl}${createUrl}`}
        clearFilter={handleClearFilter}
      />
      <DataTable
        columns={columns}
        getRowId={(row: any) => `${String(row.petitionNo)}`}
        rows={list.rows}
        pageCount={list?.count}
        currentPage={"FieldVisitList"}
        loading={isLoading}
      />
    </Grid>
  );
};

export default FieldVisitList;
